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

*此備忘由 Claude Code 於 2026-04-07 建立。觸發條件：獎金池累計達 $10,000 USDT 時，提醒執行升級。*
