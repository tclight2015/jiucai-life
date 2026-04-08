/**
 * Telegram 雙語通知服務
 * - 管理員警報（私訊給管理員，中文）
 * - 用戶廣播通知（中英雙語，發送到頻道或群組）
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!;
// 用戶廣播頻道 ID（群組/頻道，設好後填入）
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID ?? ADMIN_CHAT_ID;

const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ─── 底層發送 ──────────────────────────────────────────────────────────────

async function sendTo(chatId: string, text: string): Promise<void> {
  if (!BOT_TOKEN || !chatId) {
    console.warn("[Telegram] Missing credentials, skipping:", text.slice(0, 50));
    return;
  }
  const res = await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  if (!res.ok) console.error("[Telegram] Send failed:", await res.text());
}

/** 管理員（私訊，中文） */
const admin = (text: string) => sendTo(ADMIN_CHAT_ID, text);

/** 頻道（雙語，中文在前）*/
const channel = (zh: string, en: string) =>
  sendTo(CHANNEL_ID, `${zh}\n\n🌐 ${en}`);

function ts(): string {
  return new Date().toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── 管理員警報（只發中文給管理員）─────────────────────────────────────────

export async function alertEthLow(wallet: string, balance: string): Promise<void> {
  await admin(
    `🔴 <b>[緊急] ETH 餘額不足</b>\n` +
    `錢包: <code>${wallet}</code>\n` +
    `餘額: ${balance} ETH\n` +
    `建議充值至 0.1 ETH 以上\n` +
    `時間: ${ts()}`
  );
}

export async function alertUsdtInsufficient(required: string, available: string): Promise<void> {
  await admin(
    `🔴 <b>[緊急] 獎金池 USDT 不足</b>\n` +
    `本次需支付: ${required} USDT\n` +
    `合約餘額: ${available} USDT\n` +
    `請立即補充獎金池\n` +
    `時間: ${ts()}`
  );
}

export async function alertTxFailed(txHash: string, recipient: string, reason: string): Promise<void> {
  await admin(
    `🔴 <b>[緊急] 打款失敗</b>\n` +
    `Tx: <code>${txHash}</code>\n` +
    `收款人: <code>${recipient}</code>\n` +
    `原因: ${reason}\n` +
    `時間: ${ts()}`
  );
}

export async function alertContractError(method: string, error: string): Promise<void> {
  await admin(
    `🔴 <b>[緊急] 合約異常</b>\n` +
    `呼叫方法: ${method}\n` +
    `錯誤: ${error}\n` +
    `時間: ${ts()}`
  );
}

export async function alertClaimRetryFailed(wallet: string, attempts: number): Promise<void> {
  await admin(
    `🟡 <b>[警告] 索幣打幣連續失敗</b>\n` +
    `錢包: <code>${wallet}</code>\n` +
    `已重試: ${attempts} 次\n` +
    `時間: ${ts()}`
  );
}

export async function alertVrfTimeout(requestId: string, minutesElapsed: number): Promise<void> {
  await admin(
    `🟡 <b>[警告] Chainlink VRF 回調逾時</b>\n` +
    `Request ID: <code>${requestId}</code>\n` +
    `已等待: ${minutesElapsed} 分鐘\n` +
    `時間: ${ts()}`
  );
}

export async function alertPoolThreshold(totalUsdt: number): Promise<void> {
  await admin(
    `🔵 <b>[資訊] 獎金池達門檻 $10,000</b>\n` +
    `當前累計: $${totalUsdt.toLocaleString()} USDT\n` +
    `⚠️ 請考慮升級抽獎機制為 Chainlink VRF\n` +
    `參考: NOTES.md → 抽獎機制升級\n` +
    `時間: ${ts()}`
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
  await admin(
    `🔵 <b>[每日掃描] 持幣 14 天未中獎名單</b>\n` +
    `共 ${holders.length} 人需處理：\n\n${list}\n\n` +
    `請決定補發獎金或卡牌。\n` +
    `時間: ${ts()}`
  );
}

// ─── 用戶廣播通知（雙語）──────────────────────────────────────────────────

export async function notifyDrawReminder(
  round: number,
  date: string,
  time: string,
  usdt: number,
  jiucai: number
): Promise<void> {
  await channel(
    `🎰 <b>【抽獎預告】</b>\n` +
    `韭菜翻身日記 第 ${round} 期抽獎\n` +
    `📅 開獎時間：${date} ${time} (UTC+8)\n` +
    `💰 獎池：$${usdt} USDT · ${jiucai.toLocaleString()} JIUCAI\n\n` +
    `持幣者自動參與，持幣愈久機率愈高！`,

    `🎰 <b>[Draw Announcement]</b>\n` +
    `Jiucai Life — Round ${round}\n` +
    `📅 Draw Time: ${date} ${time} (UTC+8)\n` +
    `💰 Pool: $${usdt} USDT · ${jiucai.toLocaleString()} JIUCAI\n\n` +
    `All eligible holders entered. Hold longer = better odds!`
  );
}

export async function notifyDrawResult(
  round: number,
  winners: { wallet: string; prize: string }[],
  totalUsdt: number,
  totalJiucai: number
): Promise<void> {
  const listZh = winners.map((w, i) => `${i + 1}. <code>${w.wallet}</code>｜${w.prize}`).join("\n");
  const listEn = listZh; // 錢包地址相同，不需翻譯
  await channel(
    `🏆 <b>【開獎結果】第 ${round} 期</b>\n` +
    `共 ${winners.length} 位幸運兒中獎！\n` +
    `💰 總獎金：$${totalUsdt} USDT · ${totalJiucai.toLocaleString()} JIUCAI\n\n` +
    `恭喜以下錢包：\n${listZh}\n\n` +
    `沒中？繼續持幣，下次再來！💪`,

    `🏆 <b>[Draw Result] Round ${round}</b>\n` +
    `${winners.length} lucky winner(s)!\n` +
    `💰 Total: $${totalUsdt} USDT · ${totalJiucai.toLocaleString()} JIUCAI\n\n` +
    `Winning wallets:\n${listEn}\n\n` +
    `Didn't win? Keep holding — next round is yours! 💪`
  );
}

export async function notifyWinnerDirect(
  chatId: string,
  round: number,
  prize: string,
  eta: string
): Promise<void> {
  // 直接私訊得獎者（需要用戶先對 bot 傳過訊息才能私訊）
  await sendTo(
    chatId,
    `🎉 <b>恭喜你！韭菜翻身成功！</b>\n\n` +
    `你在第 ${round} 期抽獎中獎了！\n` +
    `獎金：${prize}\n` +
    `預計 ${eta} 內到帳\n\n` +
    `持幣就有機會，繼續加油！🌱\n\n` +
    `🌐 Congratulations! You won Round ${round}!\n` +
    `Prize: ${prize} — arriving within ${eta}. Keep holding! 🌱`
  );
}

export async function notifyClaimResult(
  chatId: string,
  approved: boolean,
  wallet: string,
  amount?: string,
  eta?: string,
  rejectReason?: string
): Promise<void> {
  if (approved) {
    await sendTo(chatId,
      `✅ <b>索幣申請已核准</b>\n錢包：<code>${wallet}</code>\n將獲得：${amount} JIUCAI\n預計 ${eta} 內打入\n\n` +
      `🌐 Claim Approved — ${amount} JIUCAI arriving within ${eta}`
    );
  } else {
    await sendTo(chatId,
      `❌ <b>索幣申請未通過</b>\n原因：${rejectReason}\n如有疑問請在吐槽區留言\n\n` +
      `🌐 Claim Rejected — Reason: ${rejectReason}`
    );
  }
}

export async function notifyInviteSuccess(
  chatId: string,
  successCount: number
): Promise<void> {
  await sendTo(chatId,
    `🎊 <b>邀請成功！</b>\n你邀請的朋友已完成索幣\n累計成功邀請：${successCount} 人\n\n邀請愈多，未來競賽優勢愈大！\n\n` +
    `🌐 Referral Success! Your friend completed a claim. Total referrals: ${successCount}`
  );
}
