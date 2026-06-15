"use strict";

const https = require("https");

const EXPLORER_URLS = {
  mainnet: "https://explorer.mantle.xyz/api",
  sepolia: "https://explorer.sepolia.mantle.xyz/api",
};

/**
 * Perform a GET request and return parsed JSON.
 */
function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`JSON parse error: ${e.message}\nBody: ${data.slice(0, 200)}`));
          }
        });
      })
      .on("error", reject);
  });
}

// Mantle JSON-RPC — public, keyless. Used by tx lookup and whale tracking,
// which need no indexer (the explorer/Etherscan API is only required for
// verified-source ABI and full wallet history).
const RPC_URLS = {
  mainnet: "https://rpc.mantle.xyz",
  sepolia: "https://rpc.sepolia.mantle.xyz",
};

function rpcCall(method, params, network = "mainnet") {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method, params });
    const u = new URL(RPC_URLS[network] || RPC_URLS.mainnet);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname,
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            const r = JSON.parse(data);
            if (r.error) reject(new Error(r.error.message || "RPC error"));
            else resolve(r.result);
          } catch (e) {
            reject(new Error(`RPC parse error: ${e.message}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

/** Hex quantity → decimal string (matches the old Etherscan-style API shape). */
const hexToDec = (h) => (h == null ? "0" : BigInt(h).toString());

/**
 * Build Mantle Scan API URL.
 * Uses MANTLE_EXPLORER_API_KEY env var if set (higher rate limits).
 */
function buildUrl(network, params) {
  const base = EXPLORER_URLS[network] || EXPLORER_URLS.mainnet;
  const apiKey = process.env.MANTLE_EXPLORER_API_KEY || "";
  const qs = new URLSearchParams({ ...params, ...(apiKey ? { apikey: apiKey } : {}) });
  return `${base}?${qs}`;
}

/**
 * Fetch transaction details by hash — via Mantle JSON-RPC (keyless).
 * Returns the same field shape the CLI expects (decimal strings).
 */
async function getTx(txHash, network = "mainnet") {
  const tx = await rpcCall("eth_getTransactionByHash", [txHash], network);
  if (!tx) throw new Error("Transaction not found — check the hash and --network (mainnet/sepolia)");

  const receipt = await rpcCall("eth_getTransactionReceipt", [txHash], network);

  let timeStamp = "0";
  if (tx.blockNumber) {
    const block = await rpcCall("eth_getBlockByNumber", [tx.blockNumber, false], network);
    if (block && block.timestamp) timeStamp = hexToDec(block.timestamp);
  }

  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: hexToDec(tx.value),
    input: tx.input,
    blockNumber: tx.blockNumber ? hexToDec(tx.blockNumber) : "0",
    gas: hexToDec(tx.gas),
    gasPrice: hexToDec(tx.gasPrice),
    gasUsed: receipt ? hexToDec(receipt.gasUsed) : "0",
    txreceipt_status: receipt ? (BigInt(receipt.status) === 1n ? "1" : "0") : "",
    timeStamp,
  };
}

/** Resolve a 4-byte selector to a function signature via the public 4byte.directory (keyless, best-effort). */
function resolve4byte(selector) {
  return new Promise((resolve) => {
    https
      .get(
        {
          hostname: "www.4byte.directory",
          path: `/api/v1/signatures/?hex_signature=${selector}`,
          headers: { Accept: "application/json", "User-Agent": "mantle-forge" },
        },
        (res) => {
          let d = "";
          res.on("data", (c) => (d += c));
          res.on("end", () => {
            try {
              const r = (JSON.parse(d).results || []).sort((a, b) => a.id - b.id);
              resolve(r.length ? r[0].text_signature : null);
            } catch {
              resolve(null);
            }
          });
        }
      )
      .on("error", () => resolve(null));
  });
}

/**
 * Inspect a contract — keyless, via Mantle JSON-RPC `eth_getCode`. Returns whether
 * the address is a contract, its bytecode size, and the function selectors found in
 * the bytecode (resolved to signatures via 4byte.directory, best-effort). Verified
 * source/ABI needs an indexer (Mantlescan key) — this gives the on-chain truth keyless.
 */
async function getContractInfo(address, network = "mainnet") {
  const code = await rpcCall("eth_getCode", [address, "latest"], network);
  if (!code || code === "0x") {
    return { address, isContract: false, bytecodeSize: 0, functions: [] };
  }
  const b = code.slice(2);
  const candidates = new Set();
  for (let i = 0; i + 10 <= b.length; i += 2) {
    if (b.slice(i, i + 2) === "63") candidates.add("0x" + b.slice(i + 2, i + 10)); // PUSH4
  }
  const selectors = [...candidates].slice(0, 48);
  const resolved = await Promise.all(
    selectors.map(async (s) => ({ selector: s, signature: await resolve4byte(s) }))
  );
  const functions = resolved
    .filter((r) => r.signature)
    .sort((a, b) => a.signature.localeCompare(b.signature));
  return { address, isContract: true, bytecodeSize: b.length / 2, functions };
}

/**
 * Recent transaction history for a wallet — keyless, via Mantle JSON-RPC. Scans the
 * last `window` blocks for transactions involving the address. Note: this is RECENT
 * activity, not full history (full history needs an indexer / Mantlescan key).
 */
async function getTxHistory(address, { network = "mainnet", offset = 20, limit, window = 60 } = {}) {
  const cap = limit || offset || 20;
  const addr = address.toLowerCase();
  const latest = parseInt(await rpcCall("eth_blockNumber", [], network), 16);

  const nums = [];
  for (let n = latest; n > latest - window && n >= 0; n--) nums.push(n);
  const blocks = await Promise.all(
    nums.map((n) =>
      rpcCall("eth_getBlockByNumber", ["0x" + n.toString(16), true], network).catch(() => null)
    )
  );

  const matches = [];
  for (const block of blocks) {
    if (!block || !Array.isArray(block.transactions)) continue;
    const ts = block.timestamp ? hexToDec(block.timestamp) : "0";
    for (const tx of block.transactions) {
      if ((tx.from || "").toLowerCase() === addr || (tx.to || "").toLowerCase() === addr) {
        matches.push({ tx, ts });
      }
    }
  }

  const capped = matches.slice(0, cap);
  return Promise.all(
    capped.map(async ({ tx, ts }) => {
      const r = await rpcCall("eth_getTransactionReceipt", [tx.hash], network).catch(() => null);
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: hexToDec(tx.value),
        input: tx.input,
        blockNumber: hexToDec(tx.blockNumber),
        gas: hexToDec(tx.gas),
        gasPrice: hexToDec(tx.gasPrice),
        gasUsed: r ? hexToDec(r.gasUsed) : "0",
        txreceipt_status: r ? (BigInt(r.status) === 1n ? "1" : "0") : "",
        timeStamp: ts,
      };
    })
  );
}

/**
 * Detect large native-MNT transfers in recent blocks (whale tracker) —
 * via Mantle JSON-RPC (keyless). MNT is the native gas token, so large
 * transfers appear as `tx.value` on regular transactions.
 */
async function getWhaleTransactions(network = "mainnet", minValueEth = 10, limit = 20) {
  const WINDOW = 30; // recent blocks to scan
  const latest = parseInt(await rpcCall("eth_blockNumber", [], network), 16);
  const minValueWei = BigInt(Math.floor(minValueEth * 1e18));

  const blockNums = [];
  for (let n = latest; n > latest - WINDOW && n >= 0; n--) blockNums.push(n);

  const blocks = await Promise.all(
    blockNums.map((n) =>
      rpcCall("eth_getBlockByNumber", ["0x" + n.toString(16), true], network).catch(() => null)
    )
  );

  const found = [];
  for (const block of blocks) {
    if (!block || !Array.isArray(block.transactions)) continue;
    const ts = block.timestamp ? hexToDec(block.timestamp) : "0";
    for (const tx of block.transactions) {
      try {
        if (BigInt(tx.value) >= minValueWei) {
          found.push({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: BigInt(tx.value).toString(),
            timeStamp: ts,
            tokenSymbol: "MNT",
          });
        }
      } catch {
        /* skip malformed tx */
      }
    }
  }

  return found
    .sort((a, b) => (BigInt(b.value) > BigInt(a.value) ? 1 : -1))
    .slice(0, limit);
}

/**
 * Format Wei value to human-readable ETH/MNT string.
 */
function formatWei(weiStr, decimals = 18, symbol = "MNT") {
  try {
    const val = Number(BigInt(weiStr)) / Math.pow(10, decimals);
    return `${val.toFixed(4)} ${symbol}`;
  } catch {
    return `${weiStr} wei`;
  }
}

/**
 * Format Unix timestamp to human-readable string.
 */
function formatTime(unixStr) {
  try {
    return new Date(Number(unixStr) * 1000).toISOString().replace("T", " ").slice(0, 19) + " UTC";
  } catch {
    return unixStr;
  }
}

module.exports = {
  getTx,
  getContractInfo,
  getTxHistory,
  getWhaleTransactions,
  formatWei,
  formatTime,
  buildUrl,
  EXPLORER_URLS,
};
