/**
 * 會員數里程碑監控
 * 每 10 分鐘查詢一次會員總數，達到指定門檻時發送管理員通知（每個門檻只發一次）
 *
 * 門檻設定：
 *   1,000 人 → 提醒開始經營 Farcaster
 *   （未來可在 MILESTONES 陣列新增更多門檻）
 */

import { alertFarcasterMilestone } from "../services/telegram";

const CHECK_INTERVAL_MS = 10 * 60 * 1000; // 10 分鐘

// 里程碑：[門檻人數, handler]
const MILESTONES: [number, (count: number) => Promise<void>][] = [
  [1_000, alertFarcasterMilestone],
];

// 已觸發過的門檻（process 存活期間不重複通知）
const triggered = new Set<number>();

async function getMemberCount(): Promise<number> {
  // TODO: 替換為實際資料庫查詢或合約呼叫
  // 範例（SQL）：SELECT COUNT(*) FROM users WHERE claimed_at IS NOT NULL
  // 範例（鏈上）：return Number(await contract.holderCount())
  return 0; // mock
}

async function checkMilestones(): Promise<void> {
  try {
    const count = await getMemberCount();

    for (const [threshold, handler] of MILESTONES) {
      if (count >= threshold && !triggered.has(threshold)) {
        triggered.add(threshold);
        await handler(count);
        console.info(`[MemberMonitor] Milestone ${threshold} triggered at count=${count}`);
      }
    }
  } catch (err) {
    console.error("[MemberMonitor] Check failed:", err);
  }
}

export function startMemberMonitor(): void {
  console.info("[MemberMonitor] Started — checking every 10 min");
  checkMilestones(); // 啟動時立即執行一次
  setInterval(checkMilestones, CHECK_INTERVAL_MS);
}
