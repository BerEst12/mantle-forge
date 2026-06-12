"use strict";

const https = require("https");
const { ADDRESSES, LB_QUOTER_ABI, ERC20_ABI, resolveToken } = require("./contracts");

const MANTLE_RPC = "https://rpc.mantle.xyz";

// ─── Minimal ethers-style ABI encoder (no deps) ──────────────────────────────

/**
 * Encode a staticcall payload for a view function.
 * Supports: address[], uint128, uint8[], uint256[] as inputs.
 */
function encodeCall(abi, fnName, args) {
  const fn = abi.find((x) => x.name === fnName);
  if (!fn) throw new Error(`Function ${fnName} not found in ABI`);

  // Function selector = first 4 bytes of keccak256(signature)
  const sig = `${fnName}(${fn.inputs.map((i) => i.type).join(",")})`;
  const selector = keccak256Selector(sig);

  // Encode arguments (simplified: supports address[], uint128 only for our use case)
  const encoded = encodeArgs(fn.inputs, args);
  return selector + encoded;
}

/** Tiny keccak256 selector — uses eth_call to compute it via RPC. */
function keccak256Selector(sig) {
  // We use the well-known selectors for our specific functions
  // findBestPathFromAmountIn(address[],uint128) = 0x...
  // Precomputed:
  const KNOWN = {
    "findBestPathFromAmountIn(address[],uint128)": "0x8a3eb1b2",
    "decimals()": "0x313ce567",
    "symbol()":   "0x95d89b41",
  };
  if (KNOWN[sig]) return KNOWN[sig].slice(2); // remove 0x
  throw new Error(`Unknown selector for: ${sig}. Add to KNOWN map.`);
}

/** Encode ABI args to hex (supports address[], uint128). */
function encodeArgs(inputs, args) {
  if (inputs.length === 0) return "";

  // For findBestPathFromAmountIn(address[], uint128):
  // Dynamic type (address[]) → offset pointer first, then uint128, then array data
  const parts = [];
  const dynamics = [];
  let staticSize = inputs.length * 32; // each slot is 32 bytes

  for (let i = 0; i < inputs.length; i++) {
    const t = inputs[i].type;
    const v = args[i];

    if (t === "address[]") {
      // pointer to dynamic data (offset = staticSize + already-placed dynamic bytes)
      const offset = staticSize + dynamics.reduce((s, d) => s + d.length / 2, 0);
      parts.push(pad32(offset.toString(16)));
      // dynamic: length + elements
      const arr = v;
      let dyn = pad32(arr.length.toString(16));
      for (const addr of arr) dyn += pad32(addr.slice(2).toLowerCase());
      dynamics.push(dyn);
    } else if (t === "uint128" || t === "uint256") {
      parts.push(pad32(BigInt(v).toString(16)));
    } else {
      throw new Error(`Unsupported ABI type: ${t}`);
    }
  }

  return parts.join("") + dynamics.join("");
}

function pad32(hex) {
  return hex.replace(/^0x/, "").padStart(64, "0");
}

// ─── RPC call ─────────────────────────────────────────────────────────────────

function rpcCall(method, params) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method, params });
    const url = new URL(MANTLE_RPC);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          const r = JSON.parse(data);
          if (r.error) reject(new Error(r.error.message));
          else resolve(r.result);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function staticCall(to, data) {
  return rpcCall("eth_call", [{ to, data: "0x" + data }, "latest"]);
}

// ─── Decode quote response ────────────────────────────────────────────────────

/**
 * Decode the Quote tuple returned by findBestPathFromAmountIn.
 * The response is a raw hex string from eth_call.
 */
function decodeQuote(hex) {
  const data = hex.replace(/^0x/, "");
  // The result is a tuple (offset pointer at position 0)
  // We read uint128[] amounts and virtualAmountsWithoutSlippage
  // Full ABI decoding is complex; we use a practical approach:
  // Find all uint128 sequences by scanning 32-byte slots

  const slots = [];
  for (let i = 0; i < data.length; i += 64) {
    slots.push(data.slice(i, i + 64));
  }

  // Heuristic: collect all non-zero values that look like token amounts
  // (realistic range: > 0 and < 2^64 ≈ 18 * 10^18 tokens)
  const values = slots
    .map((s) => { try { return BigInt("0x" + s); } catch { return 0n; } })
    .filter((v) => v > 0n && v < 2n ** 128n);

  return { raw: hex, slots, values };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get a swap quote from Merchant Moe LB Quoter.
 * @param {string} tokenIn  - symbol or address
 * @param {string} tokenOut - symbol or address
 * @param {string} amountIn - human-readable amount (e.g. "1.5")
 * @param {number} decimalsIn - token decimals (default 18)
 */
async function getSwapQuote(tokenIn, tokenOut, amountIn, decimalsIn = 18) {
  const addrIn  = resolveToken(tokenIn);
  const addrOut = resolveToken(tokenOut);

  if (!addrIn)  throw new Error(`Unknown token: ${tokenIn}. Use address or known symbol (MNT, USDC, USDT, WETH, METH)`);
  if (!addrOut) throw new Error(`Unknown token: ${tokenOut}. Use address or known symbol`);

  const amountInWei = BigInt(Math.floor(parseFloat(amountIn) * 10 ** decimalsIn));

  const calldata = encodeCall(LB_QUOTER_ABI, "findBestPathFromAmountIn", [
    [addrIn, addrOut],
    amountInWei.toString(),
  ]);

  const result = await staticCall(ADDRESSES.LB_QUOTER, calldata);
  const decoded = decodeQuote(result);

  return {
    tokenIn:     tokenIn.toUpperCase(),
    tokenOut:    tokenOut.toUpperCase(),
    addressIn:   addrIn,
    addressOut:  addrOut,
    amountIn:    amountIn,
    amountInWei: amountInWei.toString(),
    raw:         result,
    decoded:     decoded,
  };
}

/**
 * Get token decimals via ERC20 staticcall.
 */
async function getDecimals(address) {
  try {
    const data = keccak256Selector("decimals()");
    const result = await staticCall(address, data);
    return parseInt(result, 16);
  } catch {
    return 18; // default
  }
}

module.exports = { getSwapQuote, getDecimals, resolveToken, ADDRESSES };
