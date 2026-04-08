# 技術備忘錄

## 抽獎機制升級：Chainlink VRF

**觸發條件**：獎金池累計達到 **$10,000 USDT** 時，通知執行升級。

### 為什麼需要 Chainlink VRF？

目前抽獎為 off-chain 隨機（後端產生），在獎池金額小、社群信任度高的早期階段足夠使用。但當：

- 累計獎池超過 **$10,000 USDT**

時，off-chain 隨機的「無法驗證」問題會成為社群信任瓶頸，需要升級為 Chainlink VRF（Verifiable Random Function）。

### 升級要點

1. **部署 VRF Consumer 合約**
   - 繼承 `VRFConsumerBaseV2Plus`
   - 訂閱 Chainlink VRF Subscription（需充值 LINK）
   - 設定 `keyHash`（對應目標鏈的 gas lane）與 `callbackGasLimit`

2. **抽獎流程改為兩步驟**
   ```
   requestRandomWords() → 等待 Chainlink Fulfillment → fulfillRandomWords() → 執行抽獎
   ```

3. **前端整合**
   - 在 `Pool.tsx` 的開獎倒數結束後，改為觸發合約 `requestRandomWords()`
   - 監聽 `RandomWordsFulfilled` 事件，更新 UI 狀態
   - 在頁面顯示 VRF Request ID，讓用戶可自行到區塊瀏覽器驗證

4. **參考文件**
   - Chainlink VRF v2.5 Docs: https://docs.chain.link/vrf
   - Subscription Manager: https://vrf.chain.link

### 注意事項

- VRF 每次請求需消耗 LINK，需評估成本（目前約 0.25 LINK/次）
- Callback 有 gas 上限，抽獎邏輯需控制在 `callbackGasLimit` 內完成
- 測試環境可使用 Chainlink VRF Mock 合約

---

## Telegram 管理員通知

**用途**：僅通知系統異常與需要人工介入的事件，日常自動化流程（索幣審核、開獎、打幣）不通知。

**待接入**：需提供 `BOT_TOKEN` 與 `CHAT_ID` 後建立通知服務模組。

### 觸發條件（需通知）

| 事件 | 觸發時機 | 優先級 |
|------|----------|--------|
| ETH 不足 | 熱錢包 ETH < 0.05 | 🔴 緊急 |
| USDT 不足 | 獎金池合約 USDT 不夠支付本次開獎 | 🔴 緊急 |
| 打款失敗 | 任何一筆打款 tx revert / timeout | 🔴 緊急 |
| 合約異常 | 合約呼叫回傳非預期錯誤 | 🔴 緊急 |
| 索幣異常 | 索幣打幣連續失敗 3 次 | 🟡 警告 |
| Chainlink VRF 逾時 | requestRandomWords 後 10 分鐘無回調 | 🟡 警告 |
| 持幣 14 天未中獎 | 每天 00:00 掃描，列出持幣滿 14 天且從未中獎的用戶 | 🔵 資訊 |

---

### 公平保障機制：持幣 14 天必得獎

**規則**：任何持幣者在解鎖前，必須至少中過一次獎。持幣滿 14 天仍未中獎者，系統每天通知管理員，由管理員決定補發**獎金或卡牌**。

**每日掃描**：每天 00:00 UTC+8 執行，條件：
- 持幣天數 ≥ 14 天
- 歷史中獎次數 = 0
- 目前仍持幣（未全部賣出）

**通知格式**：
```
🔵 [每日掃描] 持幣 14 天未中獎名單
共 3 人需處理：

1. 0x1a2b...9f0e｜持幣 21 天｜5,000,000 JIUCAI
2. 0x9c3d...4a21｜持幣 18 天｜2,000,000 JIUCAI
3. 0x7e4f...bb12｜持幣 14 天｜1,000,000 JIUCAI

請決定補發獎金或卡牌。
```

**實作位置（待建）**：
- `server/monitors/fairnessMonitor.ts` — 每日 00:00 掃描，呼叫 Telegram 通知
- 補發動作由管理員手動執行（後續可加 bot 指令介面）

---

### 不通知（全自動）

- 索幣審核通過 / 拒絕
- 開獎執行
- 一般打幣成功
- 用戶留言 / 上傳截圖

### 通知格式

```
🔴 [緊急] ETH 餘額不足
錢包: 0x1a2b...9f0e
餘額: 0.023 ETH
建議充值至 0.1 ETH 以上
時間: 2026-04-10 20:03 UTC+8
```

### 實作位置（待建）

- `server/services/telegram.ts` — 通知發送函式
- `server/monitors/gasMonitor.ts` — ETH/USDT 餘額監控（每 5 分鐘輪詢）
- `server/monitors/txMonitor.ts` — 交易失敗監控


---

## 開獎推播流程（以週六晚上 20:00 開獎為例）

**發送對象**：頻道廣播（全體）+ 個人私訊（符合資格者 / 中獎者），兩種都有。
**節奏**：有意義的時間點，不是機械式倒數。

| 時間 | 對象 | 類型 | 內容重點 |
|------|------|------|----------|
| T-1 晚 | 全體 | 頻道廣播 | 預告明日開獎 + 獎池金額 + 加碼 CTA + **$JIUCAI 近3日漲跌幅** |
| 當天 12:00 | 符合資格者 | 個人私訊 | 你有資格！提醒 18:00 前開啟卡牌 |
| 當天 18:00 | 符合資格者 | 個人私訊 | 還有2小時，卡牌還沒開嗎？⚡ |
| 19:45 | — | 系統內部 | 最終掃描卡牌狀態（不發通知）|
| 20:00 | 管理員（你）| Telegram 私訊 | Inline keyboard：確認開獎 / 暫緩 |
| 開獎後 | 中獎者 | 個人私訊 | 恭喜中獎 + 截圖激勵（首次中獎額外獎勵）|

**不推播**：開獎總額、得獎名單（只放網站 Pool 頁面）

### 訊息格式

**T-1 頻道廣播**
```
🎰 明天晚上8點開獎！
本次預計送出 $XXX USDT
持幣越多權重越高，快去加碼！
明天中午前加碼都還來得及 💚
$JIUCAI 近三日漲跌幅：+X.X%

🌐 Tomorrow 8PM draw — $XXX USDT prize pool
Hold more = higher weight. Top up by noon! 💚
$JIUCAI 3-day change: +X.X%
```

**當天 12:00 個人私訊**
```
你符合今晚抽獎資格 🎉
記得在下午6點前開啟卡牌，提高你的中獎機率！
🌐 You qualify for tonight's draw 🎉 Activate cards before 6PM!
```

**當天 18:00 個人私訊**
```
還有2小時開獎，卡牌還沒開嗎？現在還來得及 ⚡
🌐 2 hours to draw — cards not activated yet? Still time! ⚡
```

**20:00 管理員確認（inline keyboard）**
```
🎰 第 X 期開獎時間到了
符合資格：XXX 人｜獎池：$XXX USDT
[✅ 確認開獎]  [⏸ 暫緩]
```

**開獎後 個人私訊（中獎者）**
```
恭喜你中獎了 🎉 $X USDT 已打入你的錢包
進網站 po 出收款截圖，再拿額外獎勵！此機會終身一次 💚
🌐 You won! $X USDT sent. Post receipt screenshot for a bonus! (One-time only 💚)
```

### 幣價資料
- `server/services/priceService.ts`：`getJiucaiPriceChange3d()` → DexScreener API
- 若 API 失敗回傳 `"--"`，不影響推播

### 管理員確認機制
- inline keyboard 按「確認開獎」→ 觸發 `/api/draw/confirm`
- 按「暫緩」→ 觸發 `/api/draw/postpone` + 廣播延期通知
- 實作：`server/bot/drawConfirmHandler.ts`

---

## 待辦：PWA App Icon

`public/manifest.json` 目前只有 48x48 favicon，手機加入主畫面後 icon 會模糊。
需提供品牌 icon 圖後，新增以下兩個檔案：

- `public/icon-192.png` — 192×192px
- `public/icon-512.png` — 512×512px（建議有 maskable 版本）

完成後在 manifest.json 補回對應的 icons 陣列項目即可。

---

*此備忘由 Claude Code 於 2026-04-07 建立。觸發條件：獎金池累計達 $10,000 USDT 時，提醒執行升級。*
