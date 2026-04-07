/**
 * 交易失敗監控
 * 打款失敗 → 緊急通知
 * 索幣連續失敗 3 次 → 警告通知
 */

import { alertTxFailed, alertClaimRetryFailed, alertContractError } from "../services/telegram";

const claimRetryCount = new Map<string, number>();

export async function onTxFailed(txHash: string, recipient: string, reason: string): Promise<void> {
  await alertTxFailed(txHash, reason, recipient);
}

export async function onContractError(method: string, error: string): Promise<void> {
  await alertContractError(method, error);
}

export async function onClaimRetry(wallet: string): Promise<void> {
  const count = (claimRetryCount.get(wallet) ?? 0) + 1;
  claimRetryCount.set(wallet, count);
  if (count >= 3) {
    await alertClaimRetryFailed(wallet, count);
    claimRetryCount.delete(wallet); // reset，避免重複通知
  }
}

export function onClaimSuccess(wallet: string): void {
  claimRetryCount.delete(wallet);
}
