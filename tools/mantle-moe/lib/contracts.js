"use strict";

/**
 * Merchant Moe — Mantle mainnet contract addresses (official)
 * Source: https://docs.merchantmoe.com/resources/contracts
 */
const ADDRESSES = {
  // Liquidity Book 2.2 (primary — concentrated liquidity)
  LB_ROUTER:  "0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a",
  LB_FACTORY: "0xa6630671775c4EA2743840F9A5016dCf2A104054",
  LB_QUOTER:  "0x501b8AFd35df20f531fF45F6f695793AC3316c85",

  // AMM classic v1
  MOE_ROUTER:  "0xeaEE7EE68874218c3558b40063c42B82D3E7232a",
  MOE_FACTORY: "0x5bef015ca9424a7c07b68490616a4c1f094bedec",
  MOE_TOKEN:   "0x4515A45337F461A11Ff0FE8aBF3c606AE5dC00c9",
};

/**
 * Minimal ABI — LBQuoter
 * findBestPathFromAmountsIn: quote exact-input swap
 *   route     address[]   — [tokenIn, ..., tokenOut]
 *   amountIn  uint128
 *   returns Quote {
 *     route                        address[]
 *     pairs                        address[]
 *     binSteps                     uint256[]
 *     versions                     uint8[]
 *     amounts                      uint128[]   ← amounts[last] = amountOut
 *     virtualAmountsWithoutSlippage uint128[]   ← for price impact
 *     fees                         uint128[]
 *   }
 */
const LB_QUOTER_ABI = [
  {
    type: "function",
    name: "findBestPathFromAmountIn",
    stateMutability: "view",
    inputs: [
      { name: "route",      type: "address[]" },
      { name: "amountIn",   type: "uint128"   },
    ],
    outputs: [
      {
        name: "quote",
        type: "tuple",
        components: [
          { name: "route",                        type: "address[]" },
          { name: "pairs",                        type: "address[]" },
          { name: "binSteps",                     type: "uint256[]" },
          { name: "versions",                     type: "uint8[]"   },
          { name: "amounts",                      type: "uint128[]" },
          { name: "virtualAmountsWithoutSlippage", type: "uint128[]" },
          { name: "fees",                         type: "uint128[]" },
        ],
      },
    ],
  },
];

/**
 * Minimal ABI — ERC20 (for decimals + symbol lookup)
 */
const ERC20_ABI = [
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "symbol",   stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
];

/**
 * Known Mantle mainnet token addresses (checksummed)
 */
const TOKENS = {
  WMNT:  "0x78c1B0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
  USDT:  "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
  USDC:  "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
  WETH:  "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
  METH:  "0xcDA86A272531e8640cD7F1a92c01839911B90bb0",
  MOE:   "0x4515A45337F461A11Ff0FE8aBF3c606AE5dC00c9",
  USDY:  "0x5bE26527e817998173A6343f5dF46B070B694D08",
};

/** Resolve symbol → address (case-insensitive). Returns null if not found. */
function resolveToken(symbolOrAddress) {
  if (/^0x[0-9a-fA-F]{40}$/.test(symbolOrAddress)) return symbolOrAddress;
  const upper = symbolOrAddress.toUpperCase();
  // Handle MNT → WMNT (native wraps to WMNT on DEXs)
  if (upper === "MNT") return TOKENS.WMNT;
  return TOKENS[upper] || null;
}

module.exports = { ADDRESSES, LB_QUOTER_ABI, ERC20_ABI, TOKENS, resolveToken };
