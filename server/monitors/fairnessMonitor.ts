/**
 * 公平保障機制：每天 00:00 (UTC+8) 掃描
 * 持幣 ≥ 14 天 且 從未中獎 且 目前仍持幣 → 通知管理員補發
 */

import { alertNoWinHolders, type NoWinHolder } from "../services/telegram";

async function fetchNoWinHolders(): Promise<NoWinHolder[]> {
  // TODO: 接資料庫查詢
  // SELECT wallet, hold_days, balance
  // FROM holders
  // WHERE hold_days >= 14
  //   AND win_count = 0
  //   AND balance > 0
  //   AND is_active = true
  // ORDER BY hold_days DESC

  return []; // mock — 正式接 DB 後替換
}

export async function runFairnessMonitor(): Promise<void> {
  try {
    const holders = await fetchNoWinHolders();
    await alertNoWinHolders(holders);
    console.log(`[fairnessMonitor] Scanned. Found ${holders.length} holders without win.`);
  } catch (err) {
    console.error("[fairnessMonitor] Error:", err);
  }
}

// 每天 00:00 UTC+8 (= 16:00 UTC) 執行
export function startFairnessMonitor(): void {
  const now = new Date();
  const nextRun = new Date();
  nextRun.setUTCHours(16, 0, 0, 0); // 16:00 UTC = 00:00 UTC+8
  if (nextRun <= now) nextRun.setUTCDate(nextRun.getUTCDate() + 1);

  const msUntilFirst = nextRun.getTime() - now.getTime();
  console.log(`[fairnessMonitor] First run in ${Math.round(msUntilFirst / 60000)} minutes`);

  setTimeout(() => {
    runFairnessMonitor();
    setInterval(runFairnessMonitor, 24 * 60 * 60 * 1000);
  }, msUntilFirst);
}
