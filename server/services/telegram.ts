/**
 * Telegram 雙語通知服務
 * - 管理員警報（私訊給管理員，中文）
 * - 用戶廣播通知（中英雙語，發送到頻道或群組）
 * - 分階段抽獎推播流程
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!;
// 用戶廣播頻道 ID（群組/頻道，設好後填入）
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID ?? ADMIN_CHAT_ID;

const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ─── 底層發送 ──────────────────────────────────────────────────────────────

async function sendTo(
  chatId: string,
  text: string,
  replyMarkup?: object
): Promise<void> {
  if (!BOT_TOKEN || !chatId) {
    console.warn("[Telegram] Missing credentials, skipping:", text.slice(0, 50));
    return;
  }
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };
  if (replyMarkup) body.reply_markup = replyMarkup;

  const res = await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error("[Telegram] Send failed:", await res.text());
}

/** 管理員（私訊，中文） */
const admin = (text: string, replyMarkup?: object) =>
  sendTo(ADMIN_CHAT_ID, text, replyMarkup);

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

// ─── 分階段抽獎推播流程 ────────────────────────────────────────────────────
//
// T-1 晚上   → notifyDrawAnnouncementT1   (頻道廣播，含幣價)
// 開獎日 12:00 → notifyEligibilityReminder (個別私訊資格持有者)
// 開獎日 18:00 → notifyCardActivationUrgent (個別私訊 2 小時倒數)
// 19:45       → 內部掃描，不發推播
// 20:00       → notifyAdminDrawConfirm     (管理員 inline keyboard)
// 開獎後      → notifyWinnerDirect         (個別私訊得獎者)

/**
 * T-1 開獎預告：發至頻道，含獎池金額與 JIUCAI 3 日漲跌幅
 * @param round       本期期數
 * @param drawDate    開獎日期，如 "2026/04/10"
 * @param drawTime    開獎時間，如 "20:00"
 * @param usdt        獎池 USDT 金額
 * @param jiucai      獎池 JIUCAI 數量
 * @param priceChange3d  3 日漲跌幅，如 +12.5 或 -8.3
 */
export async function notifyDrawAnnouncementT1(
  round: number,
  drawDate: string,
  drawTime: string,
  usdt: number,
  jiucai: number,
  priceChange3d: number
): Promise<void> {
  const sign = priceChange3d >= 0 ? "+" : "";
  const priceTag = `${sign}${priceChange3d.toFixed(1)}%`;
  const priceEmoji = priceChange3d >= 0 ? "📈" : "📉";

  await channel(
    `🎰 <b>【抽獎預告】第 ${round} 期</b>\n\n` +
    `📅 開獎時間：${drawDate} ${drawTime} (UTC+8)\n` +
    `💰 本期獎池：$${usdt.toLocaleString()} USDT + ${jiucai.toLocaleString()} JIUCAI\n` +
    `${priceEmoji} JIUCAI 近三日漲跌：${priceTag}\n\n` +
    `持幣者自動參與抽獎，持幣愈久中獎機率愈高！\n` +
    `記得在開獎前啟用你的幸運卡牌 🃏`,

    `🎰 <b>[Draw Announcement] Round ${round}</b>\n\n` +
    `📅 Draw Time: ${drawDate} ${drawTime} (UTC+8)\n` +
    `💰 Prize Pool: $${usdt.toLocaleString()} USDT + ${jiucai.toLocaleString()} JIUCAI\n` +
    `${priceEmoji} JIUCAI 3-Day Price Change: ${priceTag}\n\n` +
    `All eligible holders are automatically entered.\n` +
    `Activate your lucky card before the draw! 🃏`
  );
}

/**
 * 開獎日 12:00：個別私訊資格持有者，提醒開卡
 * @param chatId  持有者的 Telegram Chat ID
 * @param round   本期期數
 * @param drawTime 開獎時間，如 "20:00"
 */
export async function notifyEligibilityReminder(
  chatId: string,
  round: number,
  drawTime: string
): Promise<void> {
  await sendTo(
    chatId,
    `🃏 <b>你有資格參與今晚的抽獎！</b>\n\n` +
    `第 ${round} 期開獎時間：今日 ${drawTime} (UTC+8)\n\n` +
    `請確認你的幸運卡牌已啟用，否則將無法參與本期抽獎。\n` +
    `前往 jiucai.life → 我的 → 查看卡牌狀態\n\n` +
    `🌐 You're eligible for tonight's draw (Round ${round})!\n` +
    `Draw at ${drawTime} UTC+8. Make sure your lucky card is active!\n` +
    `Visit jiucai.life → Me → Card Status`
  );
}

/**
 * 開獎日 18:00：個別私訊持有者，2 小時倒數警示
 * @param chatId  持有者的 Telegram Chat ID
 * @param round   本期期數
 */
export async function notifyCardActivationUrgent(
  chatId: string,
  round: number
): Promise<void> {
  await sendTo(
    chatId,
    `⚡ <b>距離開獎剩 2 小時！</b>\n\n` +
    `第 ${round} 期將於 20:00 (UTC+8) 開獎\n\n` +
    `⚠️ 尚未啟用卡牌者請立即前往啟用，逾時無法補開。\n` +
    `jiucai.life → 我的 → 幸運卡牌\n\n` +
    `🌐 2 Hours to Draw (Round ${round})!\n` +
    `Draw at 20:00 UTC+8. Activate your card NOW or miss out!\n` +
    `jiucai.life → Me → Lucky Card`
  );
}

/**
 * 20:00：推送管理員確認訊息，含 inline keyboard（確認開獎 / 延後）
 * @param round          本期期數
 * @param eligibleCount  已確認資格人數
 * @param usdt           獎池 USDT
 * @param jiucai         獎池 JIUCAI
 */
export async function notifyAdminDrawConfirm(
  round: number,
  eligibleCount: number,
  usdt: number,
  jiucai: number
): Promise<void> {
  await admin(
    `🎰 <b>【開獎確認】第 ${round} 期</b>\n\n` +
    `📋 資格持有人數：${eligibleCount} 人\n` +
    `💰 獎池：$${usdt.toLocaleString()} USDT + ${jiucai.toLocaleString()} JIUCAI\n\n` +
    `請選擇操作：`,
    {
      inline_keyboard: [
        [
          { text: "✅ 確認開獎", callback_data: `draw_confirm:${round}` },
          { text: "⏸ 延後 24h",  callback_data: `draw_postpone:${round}` },
        ],
      ],
    }
  );
}

/**
 * 開獎後：個別私訊得獎者
 * @param chatId  得獎者 Telegram Chat ID
 * @param round   本期期數
 * @param prize   獎金說明，如 "$50 USDT"
 * @param eta     預計到帳時間，如 "24 小時"
 */
export async function notifyWinnerDirect(
  chatId: string,
  round: number,
  prize: string,
  eta: string
): Promise<void> {
  await sendTo(
    chatId,
    `🎉 <b>恭喜！你在第 ${round} 期中獎了！</b>\n\n` +
    `獎金：${prize}\n` +
    `預計 ${eta} 內到帳\n\n` +
    `📸 收到獎金後歡迎截圖分享到社群，讓更多韭菜看到翻身的希望！\n` +
    `持幣就有機會，繼續加油！🌱\n\n` +
    `🌐 Congratulations! You won Round ${round}!\n` +
    `Prize: ${prize} — arriving within ${eta}.\n` +
    `Screenshot your win and share it with the community! 📸\n` +
    `Keep holding, keep winning! 🌱`
  );
}

// ─── 其他用戶通知 ──────────────────────────────────────────────────────────

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
