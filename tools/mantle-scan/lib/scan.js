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
 * Fetch transaction details by hash.
 */
async function getTx(txHash, network = "mainnet") {
  const url = buildUrl(network, { module: "transaction", action: "gettxinfo", txhash: txHash });
  const res = await get(url);
  if (res.status !== "1") throw new Error(res.message || res.result || "API error");
  return res.result;
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
 * Fetch large transactions above a threshold (whale tracker).
 */
async function getWhaleTransactions(network = "mainnet", minValueEth = 10, limit = 20) {
  // Get latest block number
  const blockRes = await get(
    buildUrl(network, { module: "proxy", action: "eth_blockNumber" })
  );
  const latestBlock = parseInt(blockRes.result, 16);
  const fromBlock = Math.max(0, latestBlock - 1000);

  const url = buildUrl(network, {
    module: "account",
    action: "txlist",
    address: "0x0000000000000000000000000000000000000000",
    startblock: fromBlock,
    endblock: latestBlock,
    page: 1,
    offset: 200,
    sort: "desc",
  });

  // Whale tracker works better by fetching token transfers above threshold
  const tokenUrl = buildUrl(network, {
    module: "account",
    action: "tokentx",
    address: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb", // MNT token
    startblock: fromBlock,
    endblock: latestBlock,
    page: 1,
    offset: 200,
    sort: "desc",
  });

  const res = await get(tokenUrl);
  const txs = Array.isArray(res.result) ? res.result : [];
  const minValueWei = BigInt(Math.floor(minValueEth * 1e18));

  return txs
    .filter((tx) => {
      try {
        return BigInt(tx.value) >= minValueWei;
      } catch {
        return false;
      }
    })
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
