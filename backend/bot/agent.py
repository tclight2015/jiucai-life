"""
Claude API agent for the jiucai-life Telegram management bot.
Uses Anthropic SDK with tool use to call admin operations.
"""
import os
import json
import logging
from anthropic import Anthropic
from .tools import execute_tool

logger = logging.getLogger(__name__)

client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Per-chat conversation history (in-memory; resets on restart)
_conversations: dict[str, list] = {}

SYSTEM_PROMPT = """你是「韭菜翻身日記」平台（jiucai.life）的虛擬執行長助理。
創辦人透過 Telegram 用中文與你溝通，你幫他管理整個平台。

你的職責：
• 獎池查詢與更新
• 抽獎活動建立、執行、確認、取消
• 索幣申請審核（通過／拒絕）
• 發布公告
• 查詢統計數據、錢包資訊
• 提供營運建議

回覆規則：
• 一律使用繁體中文
• 簡潔直接，不廢話
• 執行操作前說明要做什麼，完成後回報結果
• 金額數字清楚標單位（USDT / JIUCAI）
• 遇到高風險操作（開獎確認、打幣）先確認再執行
"""

TOOLS = [
    {
        "name": "get_stats",
        "description": "取得平台整體統計：錢包數、待審核索幣數、抽獎狀態、獎池餘額",
        "input_schema": {
            "type": "object",
            "properties": {},
        },
    },
    {
        "name": "get_pool",
        "description": "取得獎池詳細餘額（USDT、JIUCAI 各分項）",
        "input_schema": {
            "type": "object",
            "properties": {},
        },
    },
    {
        "name": "update_pool",
        "description": "更新獎池餘額",
        "input_schema": {
            "type": "object",
            "properties": {
                "usdt_balance": {"type": "number", "description": "USDT 主獎池餘額"},
                "jiucai_prize_balance": {"type": "number", "description": "JIUCAI 抽獎獎池"},
                "jiucai_claim_balance": {"type": "number", "description": "JIUCAI 索幣池"},
            },
        },
    },
    {
        "name": "list_lotteries",
        "description": "列出抽獎活動",
        "input_schema": {
            "type": "object",
            "properties": {
                "status": {
                    "type": "string",
                    "description": "篩選狀態：scheduled / pending_confirm / confirmed / cancelled",
                },
                "limit": {"type": "integer", "description": "最多幾筆，預設 10"},
            },
        },
    },
    {
        "name": "create_lottery",
        "description": "建立新抽獎活動",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "活動標題"},
                "module": {
                    "type": "string",
                    "description": "抽獎模組：random（隨機）/ weighted（加權）/ top_holders（大戶）",
                },
                "draw_time": {
                    "type": "string",
                    "description": "開獎時間，ISO 格式，例如 2026-04-20T20:00:00",
                },
                "winner_count": {"type": "integer", "description": "得獎名額"},
                "usdt_prize": {"type": "number", "description": "每位得獎者獲得的 USDT"},
                "jiucai_prize": {"type": "number", "description": "每位得獎者獲得的 JIUCAI"},
            },
            "required": ["title", "module", "draw_time", "winner_count"],
        },
    },
    {
        "name": "run_lottery",
        "description": "執行抽獎（產生得獎名單，狀態改為 pending_confirm，傳送預覽給創辦人）",
        "input_schema": {
            "type": "object",
            "properties": {
                "lottery_id": {"type": "integer", "description": "抽獎 ID"},
            },
            "required": ["lottery_id"],
        },
    },
    {
        "name": "confirm_lottery",
        "description": "確認開獎，觸發鏈上打幣（高風險操作，請先確認）",
        "input_schema": {
            "type": "object",
            "properties": {
                "lottery_id": {"type": "integer", "description": "抽獎 ID"},
            },
            "required": ["lottery_id"],
        },
    },
    {
        "name": "cancel_lottery",
        "description": "取消抽獎活動",
        "input_schema": {
            "type": "object",
            "properties": {
                "lottery_id": {"type": "integer", "description": "抽獎 ID"},
            },
            "required": ["lottery_id"],
        },
    },
    {
        "name": "list_claims",
        "description": "列出索幣申請",
        "input_schema": {
            "type": "object",
            "properties": {
                "status": {
                    "type": "string",
                    "description": "狀態：pending（待審）/ approved / rejected / paid，預設 pending",
                },
                "limit": {"type": "integer", "description": "最多幾筆，預設 20"},
            },
        },
    },
    {
        "name": "approve_claim",
        "description": "批准索幣申請並觸發鏈上打幣",
        "input_schema": {
            "type": "object",
            "properties": {
                "claim_id": {"type": "integer", "description": "申請 ID"},
            },
            "required": ["claim_id"],
        },
    },
    {
        "name": "reject_claim",
        "description": "拒絕索幣申請",
        "input_schema": {
            "type": "object",
            "properties": {
                "claim_id": {"type": "integer", "description": "申請 ID"},
                "reason": {"type": "string", "description": "拒絕原因"},
            },
            "required": ["claim_id"],
        },
    },
    {
        "name": "create_announcement",
        "description": "在平台發布公告",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "公告標題"},
                "content": {"type": "string", "description": "公告內容"},
            },
            "required": ["title", "content"],
        },
    },
    {
        "name": "list_wallets",
        "description": "查詢已連結錢包列表",
        "input_schema": {
            "type": "object",
            "properties": {
                "limit": {"type": "integer", "description": "最多幾筆，預設 10"},
                "min_days": {"type": "integer", "description": "最少持幣天數"},
                "zero_wins": {"type": "boolean", "description": "只列尚未得獎的錢包"},
            },
        },
    },
    {
        "name": "blacklist_wallet",
        "description": "將錢包加入黑名單",
        "input_schema": {
            "type": "object",
            "properties": {
                "address": {"type": "string", "description": "錢包地址"},
                "reason": {"type": "string", "description": "原因"},
            },
            "required": ["address"],
        },
    },
]


def handle_message(chat_id: str, user_text: str) -> str:
    """
    Process a user message and return the assistant's reply.
    Maintains per-chat conversation history.
    """
    history = _conversations.setdefault(chat_id, [])
    history.append({"role": "user", "content": user_text})

    # Keep last 30 messages to avoid exceeding context
    if len(history) > 30:
        _conversations[chat_id] = history[-30:]
        history = _conversations[chat_id]

    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        tools=TOOLS,
        messages=history,
    )

    # Agentic tool-use loop
    while response.stop_reason == "tool_use":
        # Collect tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                logger.info("Tool call: %s %s", block.name, block.input)
                result = execute_tool(block.name, block.input)
                logger.info("Tool result: %s", result)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result, ensure_ascii=False),
                })

        # Append assistant turn (with tool_use blocks) and tool results
        history.append({"role": "assistant", "content": response.content})
        history.append({"role": "user", "content": tool_results})

        response = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=history,
        )

    # Extract final text
    text_parts = [block.text for block in response.content if hasattr(block, "text")]
    final_text = "\n".join(text_parts).strip() or "（無回覆）"

    # Save final assistant turn
    history.append({"role": "assistant", "content": response.content})

    return final_text


def clear_history(chat_id: str):
    """Reset conversation history for a chat."""
    _conversations.pop(chat_id, None)
