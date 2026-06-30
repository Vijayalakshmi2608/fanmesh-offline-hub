import type { Transaction } from "@/types";
import { CURRENT_USER, TRANSACTIONS } from "@/mock";
import { cloneMock, withMockLatency } from "../mockLatency";

let balance = CURRENT_USER.walletBalance;
let transactions = cloneMock(TRANSACTIONS);

export const WalletService = {
  // TODO: Replace WalletService with WDK
  async getBalance(): Promise<number> {
    return withMockLatency(() => balance);
  },

  // TODO: Replace WalletService with WDK
  async getTransactions(): Promise<Transaction[]> {
    return withMockLatency(() => cloneMock(transactions));
  },
};
