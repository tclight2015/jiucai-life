/**
 * 後端服務入口
 * 啟動所有監控器
 */

import { startGasMonitor } from "./monitors/gasMonitor";
import { startFairnessMonitor } from "./monitors/fairnessMonitor";

console.log("[Server] Starting monitors...");
startGasMonitor();
startFairnessMonitor();
console.log("[Server] All monitors running.");

// txMonitor 的函式由各 API route 在需要時直接呼叫
// 例如: import { onTxFailed } from "./monitors/txMonitor"
