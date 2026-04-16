"""
Telegram webhook blueprint.
Registers at /bot/webhook — set this URL in Telegram via setWebhook.
Only the owner (TELEGRAM_OWNER_CHAT_ID) can interact with the bot.
"""
import os
import logging
import threading
import requests as http_requests
from flask import Blueprint, request, jsonify

from .agent import handle_message, clear_history

logger = logging.getLogger(__name__)

bot_bp = Blueprint("bot", __name__, url_prefix="/bot")

HELP_TEXT = """🤖 <b>韭菜翻身日記 管理 Bot</b>

直接用中文說你要做什麼，例如：
• 查獎池狀態
• 列出待審核索幣申請
• 建立一個下週三晚上8點的隨機抽獎，獎金100 USDT，3名得獎
• 批准索幣申請 #5
• 發公告：今晚21:00開獎

<b>特殊指令：</b>
/start /help — 顯示此說明
/clear — 清除對話記憶，重新開始
/stats — 快速查看平台統計"""


def _get_owner_chat_id() -> str:
    return os.getenv("TELEGRAM_OWNER_CHAT_ID", "")


def _send(chat_id: str, text: str, parse_mode: str = "HTML"):
    """Send a Telegram message."""
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not token:
        logger.warning("TELEGRAM_BOT_TOKEN not set")
        return
    try:
        resp = http_requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={"chat_id": chat_id, "text": text, "parse_mode": parse_mode},
            timeout=15,
        )
        resp.raise_for_status()
    except Exception as e:
        logger.error("Telegram send error: %s", e)


def _send_typing(chat_id: str):
    """Show typing indicator."""
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not token:
        return
    try:
        http_requests.post(
            f"https://api.telegram.org/bot{token}/sendChatAction",
            json={"chat_id": chat_id, "action": "typing"},
            timeout=5,
        )
    except Exception:
        pass


def _process_message(chat_id: str, text: str):
    """Called in a background thread: run Claude agent and reply."""
    try:
        _send_typing(chat_id)
        reply = handle_message(chat_id, text)
        # Telegram message limit is 4096 chars — split if needed
        while reply:
            chunk, reply = reply[:4000], reply[4000:]
            _send(chat_id, chunk)
    except Exception as e:
        logger.error("Bot processing error: %s", e, exc_info=True)
        _send(chat_id, f"❌ 發生錯誤，請稍後再試。\n<code>{e}</code>")


@bot_bp.post("/webhook")
def webhook():
    data = request.get_json(silent=True) or {}
    owner = _get_owner_chat_id()

    # Handle regular messages and edited messages
    message = data.get("message") or data.get("edited_message")
    if not message:
        return jsonify({"ok": True})

    chat_id = str(message.get("chat", {}).get("id", ""))
    text = (message.get("text") or "").strip()

    # Security: only respond to owner
    if not owner or chat_id != owner:
        logger.warning("Rejected message from chat_id=%s (owner=%s)", chat_id, owner)
        return jsonify({"ok": True})

    if not text:
        return jsonify({"ok": True})

    # Handle special commands
    if text in ("/start", "/help"):
        _send(chat_id, HELP_TEXT)
        return jsonify({"ok": True})

    if text == "/clear":
        clear_history(chat_id)
        _send(chat_id, "✅ 對話記憶已清除")
        return jsonify({"ok": True})

    if text == "/stats":
        # Quick stats shortcut — delegate to agent
        text = "給我一個平台總覽：獎池、錢包數、待審核索幣、抽獎狀態"

    # Process in background thread to avoid Telegram timeout
    threading.Thread(
        target=_process_message,
        args=(chat_id, text),
        daemon=True,
    ).start()

    return jsonify({"ok": True})


@bot_bp.get("/set-webhook")
def set_webhook():
    """
    Convenience endpoint: GET /bot/set-webhook?url=https://your-backend/bot/webhook
    Call this once after deployment to register the webhook with Telegram.
    Protected by ADMIN_TOKEN.
    """
    from flask import abort
    auth = request.headers.get("Authorization", "")
    if auth != f"Bearer {os.getenv('ADMIN_TOKEN', '')}":
        abort(401)

    webhook_url = request.args.get("url", "")
    if not webhook_url:
        # Auto-detect from BACKEND_URL env var
        backend_url = os.getenv("BACKEND_URL", "").rstrip("/")
        if not backend_url:
            return jsonify({"error": "請提供 ?url= 或設定 BACKEND_URL 環境變數"}), 400
        webhook_url = f"{backend_url}/bot/webhook"

    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not token:
        return jsonify({"error": "TELEGRAM_BOT_TOKEN 未設定"}), 500

    resp = http_requests.post(
        f"https://api.telegram.org/bot{token}/setWebhook",
        json={"url": webhook_url},
        timeout=10,
    )
    return jsonify({"telegram_response": resp.json(), "webhook_url": webhook_url})


@bot_bp.get("/webhook-info")
def webhook_info():
    """Check current webhook status. Protected by ADMIN_TOKEN."""
    from flask import abort
    auth = request.headers.get("Authorization", "")
    if auth != f"Bearer {os.getenv('ADMIN_TOKEN', '')}":
        abort(401)

    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not token:
        return jsonify({"error": "TELEGRAM_BOT_TOKEN 未設定"}), 500

    resp = http_requests.get(
        f"https://api.telegram.org/bot{token}/getWebhookInfo",
        timeout=10,
    )
    return jsonify(resp.json())
