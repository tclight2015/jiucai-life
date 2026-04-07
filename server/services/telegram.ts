/**
 * Telegram 管理員通知服務
 * 僅用於系統異常與需人工介入的事件，日常自動化不通知
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!;
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export type AlertLevel = "🔴 緊急" | "🟡 警告" | "🔵 資訊";

async function sendMessage(text: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("[Telegram] Missing BOT_TOKEN or CHAT_ID, skipping alert");
    return;
  }
  const res = await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("[Telegram] Failed to send message:", err);
  }
}

function timestamp(): string {
  return new Date().toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── 個別通知函式 ────────────────────────────────────────

export async function alertEthLow(wallet: string, balance: string): Promise<void> {
  await sendMessage(
    `🔴 <b>[緊急] ETH 餘額不足</b>\n` +
    `錢包: <code>${wallet}</code>\n` +
    `餘額: ${balance} ETH\n` +
    `建議充值至 0.1 ETH 以上\n` +
    `時間: ${timestamp()}`
  );
}

export async function alertUsdtInsufficient(required: string, available: string): Promise<void> {
  await sendMessage(
    `🔴 <b>[緊急] 獎金池 USDT 不足</b>\n` +
    `本次需支付: ${required} USDT\n` +
    `合約餘額: ${available} USDT\n` +
    `請立即補充獎金池\n` +
    `時間: ${timestamp()}`
  );
}

export async function alertTxFailed(txHash: string, reason: string, recipient: string): Promise<void> {
  await sendMessage(
    `🔴 <b>[緊急] 打款失敗</b>\n` +
    `Tx: <code>${txHash}</code>\n` +
    `收款人: <code>${recipient}</code>\n` +
    `原因: ${reason}\n` +
    `時間: ${timestamp()}`
  );
}

export async function alertContractError(method: string, error: string): Promise<void> {
  await sendMessage(
    `🔴 <b>[緊急] 合約異常</b>\n` +
    `呼叫方法: ${method}\n` +
    `錯誤: ${error}\n` +
    `時間: ${timestamp()}`
  );
}

export async function alertClaimRetryFailed(wallet: string, attempts: number): Promise<void> {
  await sendMessage(
    `🟡 <b>[警告] 索幣打幣連續失敗</b>\n` +
    `錢包: <code>${wallet}</code>\n` +
    `已重試: ${attempts} 次\n` +
    `時間: ${timestamp()}`
  );
}

export async function alertVrfTimeout(requestId: string, minutesElapsed: number): Promise<void> {
  await sendMessage(
    `🟡 <b>[警告] Chainlink VRF 回調逾時</b>\n` +
    `Request ID: <code>${requestId}</code>\n` +
    `已等待: ${minutesElapsed} 分鐘\n` +
    `時間: ${timestamp()}`
  );
}

export async function alertPoolThreshold(totalUsdt: number): Promise<void> {
  await sendMessage(
    `🔵 <b>[資訊] 獎金池達門檻 $10,000</b>\n` +
    `當前累計: $${totalUsdt.toLocaleString()} USDT\n` +
    `⚠️ 請考慮升級抽獎機制為 Chainlink VRF\n` +
    `參考: NOTES.md → 抽獎機制升級\n` +
    `時間: ${timestamp()}`
  );
}

export interface NoWinHolder {
  wallet: string;
  holdDays: number;
  balance: string;
}

export async function alertNoWinHolders(holders: NoWinHolder[]): Promise<void> {
  if (holders.length === 0) return;
  const list = holders
    .map((h, i) => `${i + 1}. <code>${h.wallet}</code>｜持幣 ${h.holdDays} 天｜${h.balance} JIUCAI`)
    .join("\n");
  await sendMessage(
    `🔵 <b>[每日掃描] 持幣 14 天未中獎名單</b>\n` +
    `共 ${holders.length} 人需處理：\n\n` +
    `${list}\n\n` +
    `請決定補發獎金或卡牌。\n` +
    `時間: ${timestamp()}`
  );
}
