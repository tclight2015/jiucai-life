"""
Telegram notification service.
Uses python-telegram-bot in synchronous mode.
"""
import os
import logging
import requests

logger = logging.getLogger(__name__)

BOT_TOKEN = None
OWNER_CHAT_ID = None


def _bot_token():
    return os.getenv("TELEGRAM_BOT_TOKEN")


def _owner_chat_id():
    return os.getenv("TELEGRAM_OWNER_CHAT_ID", "")


def _send_message(chat_id: str, text: str, parse_mode="HTML"):
    token = _bot_token()
    if not token:
        logger.warning("TELEGRAM_BOT_TOKEN not set, skipping message")
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        resp = requests.post(url, json={"chat_id": chat_id, "text": text, "parse_mode": parse_mode}, timeout=10)
        resp.raise_for_status()
    except Exception as e:
        logger.error("Telegram send error: %s", e)


def notify_owner(text: str):
    _send_message(_owner_chat_id(), text)


def notify_user(chat_id: str, text: str):
    _send_message(chat_id, text)


def notify_owner_draw_preview(lottery, winners):
    lines = [
        f"🎰 <b>開獎預覽</b> — {lottery.title}",
        f"模組：{lottery.module} | 名額：{lottery.winner_count}",
        f"獎金：${lottery.usdt_prize} USDT + {lottery.jiucai_prize} JIUCAI",
        "",
        "<b>得獎名單：</b>",
    ]
    for i, w in enumerate(winners, 1):
        addr = w.wallet_address
        lines.append(f"{i}. {addr[:6]}...{addr[-4:]}  ${w.usdt_amount} USDT")

    lines += [
        "",
        "請回覆確認：",
        "✅ /confirm_{lottery.id}  — 立即打幣",
        "⏸ /hold_{lottery.id}  — 暫緩",
    ]
    notify_owner("\n".join(lines).replace("{lottery.id}", str(lottery.id)))


def broadcast_draw_result(lottery, winners):
    """Notify each winner via Telegram if bound."""
    from models import Wallet
    for w in winners:
        wallet = Wallet.query.filter_by(address=w.wallet_address).first()
        if wallet and wallet.telegram_chat_id:
            msg = (
                f"🎉 恭喜中獎！\n"
                f"活動：{lottery.title}\n"
                f"獎金：${w.usdt_amount} USDT + {w.jiucai_amount} JIUCAI\n"
                f"交易：{w.tx_hash}\n\n"
                "Po出收款截圖可獲額外加碼獎勵，此機會終身一次，把握機會！"
            )
            notify_user(wallet.telegram_chat_id, msg)


def send_daily_report(stats: dict):
    msg = (
        "📊 韭菜翻身日記日報\n"
        f"獎池：${stats.get('usdt_balance', 0)} USDT / {stats.get('jiucai_prize', 0)} JIUCAI\n"
        f"今日新增錢包：{stats.get('new_wallets', 0)}\n"
        f"累積發出獎金：${stats.get('total_usdt_paid_out', 0)} USDT\n"
        f"待審核索幣：{stats.get('pending_claims', 0)}"
    )
    notify_owner(msg)
