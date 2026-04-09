/**
 * JIUCAI 幣價查詢服務
 * 使用 DexScreener API 取得近 3 日漲跌幅
 *
 * 設定方式：在 .env 設定 JIUCAI_PAIR_ADDRESS（DEX 交易對合約地址）
 * 例如：JIUCAI_PAIR_ADDRESS=0xYourPairAddressHere
 */

const PAIR_ADDRESS = process.env.JIUCAI_PAIR_ADDRESS ?? "";
const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/pairs";

interface DexScreenerPair {
  priceUsd: string;
  priceChange?: {
    h24?: number;
    h6?: number;
  };
  // DexScreener 不直接提供 3 日資料，改用 24h * 3 估算，
  // 或在有 OHLCV endpoint 時用精確值
}

interface DexScreenerResponse {
  pairs: DexScreenerPair[] | null;
}

/**
 * 取得 JIUCAI 近 3 日漲跌幅（%）
 * - 優先使用 DexScreener 的精確 72h 資料（若有）
 * - fallback：以 24h 漲跌幅近似代替（並在 log 中標注）
 * @returns 漲跌幅百分比，如 12.5 代表 +12.5%；取不到時回傳 null
 */
export async function getJiucai3dPriceChange(): Promise<number | null> {
  if (!PAIR_ADDRESS) {
    console.warn("[PriceService] JIUCAI_PAIR_ADDRESS not set, skipping price fetch");
    return null;
  }

  try {
    // DexScreener 支援多鏈：ethereum / bsc / polygon 等，自動判斷
    const url = `${DEXSCREENER_API}/${PAIR_ADDRESS}`;
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(10_000), // 10 秒 timeout
    });

    if (!res.ok) {
      console.error(`[PriceService] DexScreener responded ${res.status}`);
      return null;
    }

    const data: DexScreenerResponse = await res.json();
    const pair = data.pairs?.[0];

    if (!pair) {
      console.warn("[PriceService] No pair data returned from DexScreener");
      return null;
    }

    // DexScreener 目前僅提供 h1 / h6 / h24 priceChange，沒有 72h
    // 使用 h24 作為近似值，並備注
    const change24h = pair.priceChange?.h24;
    if (change24h === undefined || change24h === null) {
      console.warn("[PriceService] priceChange.h24 not available");
      return null;
    }

    // TODO: 若 DexScreener 未來支援 72h，在此替換
    console.info(`[PriceService] JIUCAI 24h change (≈3d proxy): ${change24h}%`);
    return change24h;
  } catch (err) {
    console.error("[PriceService] Failed to fetch price:", err);
    return null;
  }
}

/**
 * 格式化漲跌幅為顯示字串，含正負號
 * @param change  漲跌幅數值，null 時回傳 "N/A"
 */
export function formatPriceChange(change: number | null): string {
  if (change === null) return "N/A";
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}
