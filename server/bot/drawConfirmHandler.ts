/**
 * 抽獎確認 Inline Keyboard 回調處理
 *
 * 管理員在 20:00 收到含 inline keyboard 的確認訊息後，
 * 點擊「確認開獎」或「延後 24h」，Telegram 會送 callback_query 到本 webhook。
 *
 * callback_data 格式：
 *   draw_confirm:<round>    → 執行開獎
 *   draw_postpone:<round>   → 延後 24 小時
 *
 * 接入方式：
 *   在 Express/Fastify route POST /bot/webhook 中，
 *   判斷 update.callback_query 是否存在，然後呼叫 handleDrawCallback(update.callback_query)
 */

import { alertContractError } from "../services/telegram";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!;
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface CallbackQuery {
  id: string;
  from: { id: number; username?: string };
  message?: { message_id: number; chat: { id: number } };
  data?: string;
}

/** 回應 answerCallbackQuery，消除 loading 動畫 */
async function answerCallback(callbackId: string, text: string): Promise<void> {
  await fetch(`${API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId, text, show_alert: false }),
  });
}

/** 編輯原訊息，移除 inline keyboard 並更新狀態文字 */
async function editMessage(
  chatId: number,
  messageId: number,
  text: string
): Promise<void> {
  await fetch(`${API}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [] }, // 移除按鈕
    }),
  });
}

/**
 * 實際執行開獎邏輯（stub）
 * 替換此函式，接入你的 drawService / smartContract 呼叫
 */
async function executeDraw(round: number): Promise<void> {
  // TODO: 呼叫 drawService.runDraw(round)
  console.info(`[DrawConfirmHandler] Executing draw for round ${round}`);
}

/**
 * 延後開獎邏輯（stub）
 * 替換此函式，更新資料庫中的預定開獎時間 +24h
 */
async function postponeDraw(round: number): Promise<void> {
  // TODO: 呼叫 drawService.postpone(round, 24 * 60 * 60 * 1000)
  console.info(`[DrawConfirmHandler] Postponing draw for round ${round} by 24h`);
}

/**
 * 處理管理員的 inline keyboard 回調
 * 只允許 ADMIN_CHAT_ID 操作，其他人點擊一律忽略
 */
export async function handleDrawCallback(query: CallbackQuery): Promise<void> {
  const { id: callbackId, from, message, data } = query;

  // 安全性：只允許管理員操作
  if (String(from.id) !== ADMIN_CHAT_ID) {
    await answerCallback(callbackId, "⛔ 無操作權限");
    return;
  }

  if (!data || !message) {
    await answerCallback(callbackId, "❌ 無效操作");
    return;
  }

  const [action, roundStr] = data.split(":");
  const round = parseInt(roundStr, 10);

  if (isNaN(round)) {
    await answerCallback(callbackId, "❌ 期數解析失敗");
    return;
  }

  const chatId = message.chat.id;
  const messageId = message.message_id;

  if (action === "draw_confirm") {
    await answerCallback(callbackId, "✅ 開獎執行中…");
    try {
      await executeDraw(round);
      await editMessage(
        chatId,
        messageId,
        `✅ <b>第 ${round} 期開獎已確認執行</b>\n\n` +
        `操作人：@${from.username ?? from.id}\n` +
        `時間：${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      await alertContractError("drawConfirmHandler.executeDraw", errMsg);
      await editMessage(chatId, messageId, `❌ <b>開獎執行失敗</b>\n錯誤：${errMsg}`);
    }
  } else if (action === "draw_postpone") {
    await answerCallback(callbackId, "⏸ 已延後 24 小時");
    try {
      await postponeDraw(round);
      await editMessage(
        chatId,
        messageId,
        `⏸ <b>第 ${round} 期開獎已延後 24 小時</b>\n\n` +
        `操作人：@${from.username ?? from.id}\n` +
        `時間：${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      await alertContractError("drawConfirmHandler.postponeDraw", errMsg);
      await editMessage(chatId, messageId, `❌ <b>延後操作失敗</b>\n錯誤：${errMsg}`);
    }
  } else {
    await answerCallback(callbackId, "❓ 未知操作");
  }
}
