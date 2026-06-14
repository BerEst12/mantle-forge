"use strict";

const https = require("https");

// Merchant Moe pool data via GeckoTerminal (CoinGecko's on-chain DEX API).
// Public, keyless. Covers both the classic AMM and the Liquidity Book DEX on Mantle.
// (The legacy Graph hosted-service subgraph was shut down in 2024.)
const GECKOTERMINAL_BASE = "https://api.geckoterminal.com/api/v2";
const MOE_DEXES = ["merchant-moe-liquidity-book-mantle", "merchant-moe-mantle"];

/**
 * GET a JSON-API resource (GeckoTerminal). Sends an Accept header and surfaces
 * HTTP/JSON errors rather than silently returning HTML.
 */
function get(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: "GET",
      headers: { Accept: "application/json", "User-Agent": "mantle-forge" },
    };
    https
      .get(options, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          if (res.statusCode >= 400) {
            return reject(new Error(`HTTP ${res.statusCode} from ${u.hostname}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`JSON parse error: ${e.message}`));
          }
        });
      })
      .on("error", reject);
  });
}

/** Map one GeckoTerminal pool resource to our pool shape. */
function mapGtPool(p) {
  const a = p.attributes || {};
  const name = a.name || "";
  const [token0 = "", token1 = ""] = name.split(" / ");
  const tx = (a.transactions && a.transactions.h24) || {};
  return {
    id: a.address || p.id,
    symbol: name.replace(" / ", "/"),
    token0,
    token1,
    liquidityUSD: parseFloat(a.reserve_in_usd || 0),
    volumeUSD: parseFloat((a.volume_usd && a.volume_usd.h24) || 0),
    txCount: (parseInt(tx.buys || 0) || 0) + (parseInt(tx.sells || 0) || 0),
    apy: null, // GeckoTerminal does not expose pool APY
    source: "geckoterminal",
  };
}

/**
 * Fetch Merchant Moe pools on Mantle from GeckoTerminal (both Moe DEXes),
 * sorted by liquidity (default) or 24h volume.
 */
async function getPools({ limit = 20, orderBy = "reserveUSD" } = {}) {
  const results = await Promise.allSettled(
    MOE_DEXES.map((dex) =>
      get(`${GECKOTERMINAL_BASE}/networks/mantle/dexes/${dex}/pools?page=1`)
    )
  );

  let pools = [];
  for (const r of results) {
    if (r.status === "fulfilled" && r.value && Array.isArray(r.value.data)) {
      pools.push(...r.value.data.map(mapGtPool));
    }
  }
  if (pools.length === 0) {
    throw new Error("no pools returned from GeckoTerminal");
  }

  const key = orderBy === "volumeUSD" ? "volumeUSD" : "liquidityUSD";
  pools.sort((a, b) => (b[key] || 0) - (a[key] || 0));
  return pools.slice(0, limit);
}

// Backwards-compatible alias (kept so existing imports/tests don't break).
const getPoolsFromDefiLlama = (limit = 20) => getPools({ limit });

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
  GECKOTERMINAL_BASE,
  MOE_DEXES,
};
