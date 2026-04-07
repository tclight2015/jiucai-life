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
| 獎池達門檻 | 累計 USDT 超過 $10,000（提醒升級 VRF）| 🔵 資訊 |

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



`public/manifest.json` 目前只有 48x48 favicon，手機加入主畫面後 icon 會模糊。
需提供品牌 icon 圖後，新增以下兩個檔案：

- `public/icon-192.png` — 192×192px
- `public/icon-512.png` — 512×512px（建議有 maskable 版本）

完成後在 manifest.json 補回對應的 icons 陣列項目即可。

---

*此備忘由 Claude Code 於 2026-04-07 建立。觸發條件：獎金池累計達 $10,000 USDT 時，提醒執行升級。*
