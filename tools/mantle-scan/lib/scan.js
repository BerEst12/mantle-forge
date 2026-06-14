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

/**
 * Fetch contract ABI.
 */
async function getContractAbi(address, network = "mainnet") {
  const url = buildUrl(network, { module: "contract", action: "getabi", address });
  const res = await get(url);
  if (res.status !== "1") throw new Error(res.message || res.result || "ABI not found");
  return JSON.parse(res.result);
}

/**
 * Fetch contract source info.
 */
async function getContractSource(address, network = "mainnet") {
  const url = buildUrl(network, { module: "contract", action: "getsourcecode", address });
  const res = await get(url);
  if (res.status !== "1") throw new Error(res.message || res.result || "Source not found");
  return res.result[0];
}

/**
 * Fetch transaction history for an address.
 */
async function getTxHistory(address, { network = "mainnet", page = 1, offset = 20, sort = "desc" } = {}) {
  const url = buildUrl(network, {
    module: "account",
    action: "txlist",
    address,
    startblock: 0,
    endblock: 99999999,
    page,
    offset,
    sort,
  });
  const res = await get(url);
  if (res.status !== "1" && res.message !== "No transactions found") {
    throw new Error(res.message || res.result || "API error");
  }
  return Array.isArray(res.result) ? res.result : [];
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
  getContractAbi,
  getContractSource,
  getTxHistory,
  getWhaleTransactions,
  formatWei,
  formatTime,
  buildUrl,
  EXPLORER_URLS,
};
