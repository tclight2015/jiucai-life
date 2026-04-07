/**
 * 每 5 分鐘監控熱錢包 ETH 餘額與獎金池 USDT 餘額
 * ETH < 0.05 → 緊急通知
 * USDT 不夠支付下次開獎 → 緊急通知
 * 累計 USDT > $10,000 → 升級提醒
 */

import { alertEthLow, alertUsdtInsufficient, alertPoolThreshold } from "../services/telegram";

const ETH_THRESHOLD = 0.05;       // ETH 警戒線
const POOL_ALERT_THRESHOLD = 10000; // USDT 升級提醒門檻
let poolAlertSent = false;          // 只通知一次

async function getEthBalance(wallet: string): Promise<number> {
  // TODO: 接 ethers.js / viem provider
  // const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  // const balance = await provider.getBalance(wallet);
  // return parseFloat(ethers.formatEther(balance));
  return 0.12; // mock
}

async function getUsdtBalance(contractAddress: string): Promise<number> {
  // TODO: 讀合約 USDT 餘額
  return 500; // mock
}

async function getNextDrawAmount(): Promise<number> {
  // TODO: 從資料庫讀本次開獎預計金額
  return 50; // mock
}

async function getTotalPoolUsdt(): Promise<number> {
  // TODO: 從資料庫讀累計獎金
  return 3200; // mock
}

export async function runGasMonitor(): Promise<void> {
  const wallet = process.env.ADMIN_WALLET_ADDRESS!;

  try {
    // 1. ETH 餘額
    const ethBalance = await getEthBalance(wallet);
    if (ethBalance < ETH_THRESHOLD) {
      await alertEthLow(wallet, ethBalance.toFixed(4));
    }

    // 2. USDT 餘額 vs 下次開獎需求
    const usdtBalance = await getUsdtBalance(process.env.JIUCAI_CONTRACT_ADDRESS!);
    const nextDraw = await getNextDrawAmount();
    if (usdtBalance < nextDraw) {
      await alertUsdtInsufficient(nextDraw.toString(), usdtBalance.toString());
    }

    // 3. 獎池門檻提醒（只發一次）
    if (!poolAlertSent) {
      const total = await getTotalPoolUsdt();
      if (total >= POOL_ALERT_THRESHOLD) {
        await alertPoolThreshold(total);
        poolAlertSent = true;
      }
    }
  } catch (err) {
    console.error("[gasMonitor] Error:", err);
  }
}

// 每 5 分鐘執行
export function startGasMonitor(): void {
  runGasMonitor();
  setInterval(runGasMonitor, 5 * 60 * 1000);
}
