"use strict";

const https = require("https");

// Merchant Moe subgraph on Mantle (The Graph)
const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/merchant-moe/merchant-moe-mantle";

// Fallback: DefiLlama for Merchant Moe pools
const DEFILLAMA_POOLS_URL = "https://yields.llama.fi/pools";

/**
 * Execute a GraphQL query against the Merchant Moe subgraph.
 */
function querySubgraph(query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query });
    const url = new URL(SUBGRAPH_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.errors) reject(new Error(parsed.errors[0].message));
          else resolve(parsed.data);
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

/**
 * GET request helper for REST endpoints.
 */
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
    }).on("error", reject);
  });
}

/**
 * Fetch Merchant Moe pools via subgraph.
 * Falls back to DefiLlama if subgraph is unavailable.
 */
async function getPools({ limit = 20, orderBy = "reserveUSD" } = {}) {
  try {
    const data = await querySubgraph(`{
      pairs(first: ${limit}, orderBy: ${orderBy}, orderDirection: desc) {
        id
        token0 { symbol decimals }
        token1 { symbol decimals }
        reserveUSD
        volumeUSD
        txCount
        token0Price
        token1Price
      }
    }`);
    return (data.pairs || []).map((p) => ({
      id: p.id,
      symbol: `${p.token0.symbol}/${p.token1.symbol}`,
      token0: p.token0.symbol,
      token1: p.token1.symbol,
      liquidityUSD: parseFloat(p.reserveUSD || 0),
      volumeUSD: parseFloat(p.volumeUSD || 0),
      txCount: parseInt(p.txCount || 0),
      price0: parseFloat(p.token0Price || 0),
      price1: parseFloat(p.token1Price || 0),
      source: "subgraph",
    }));
  } catch {
    // Fallback to DefiLlama
    return getPoolsFromDefiLlama(limit);
  }
}

/**
 * DefiLlama fallback for Merchant Moe pools.
 */
async function getPoolsFromDefiLlama(limit = 20) {
  const data = await get(DEFILLAMA_POOLS_URL);
  const pools = (data.data || [])
    .filter((p) => p.chain === "Mantle" && p.project === "merchant-moe")
    .sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))
    .slice(0, limit);

  return pools.map((p) => ({
    id: p.pool,
    symbol: p.symbol,
    token0: p.symbol.split("-")[0] || "",
    token1: p.symbol.split("-")[1] || "",
    liquidityUSD: p.tvlUsd || 0,
    volumeUSD: 0,
    apy: p.apy || 0,
    apyBase: p.apyBase || 0,
    apyReward: p.apyReward || 0,
    txCount: 0,
    source: "defillama",
  }));
}

/**
 * Find best pool for a given token pair.
 */
async function getBestPool(tokenA, tokenB) {
  const pools = await getPools({ limit: 100 });
  const symA = tokenA.toUpperCase();
  const symB = tokenB.toUpperCase();

  const matches = pools.filter((p) => {
    const s = p.symbol.toUpperCase();
    return (
      (s.includes(symA) && s.includes(symB)) ||
      (p.token0.toUpperCase() === symA && p.token1.toUpperCase() === symB) ||
      (p.token0.toUpperCase() === symB && p.token1.toUpperCase() === symA)
    );
  });

  matches.sort((a, b) => b.liquidityUSD - a.liquidityUSD);
  return matches;
}

/**
 * Format USD value.
 */
function formatUSD(val) {
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
  return `$${val.toFixed(2)}`;
}

module.exports = {
  getPools,
  getBestPool,
  getPoolsFromDefiLlama,
  formatUSD,
  SUBGRAPH_URL,
};
