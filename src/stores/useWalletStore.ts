import { create } from "zustand";
import { Transaction } from "@/types";
import { CURRENT_USER, TRANSACTIONS } from "@/mock";

interface WalletStore {
  balance: number;
  transactions: Transaction[];
  selectedWallet: string;
  qrCodePlaceholder: string;

  send: (amount: number, recipient: string, note: string) => void;
  receive: (amount: number, sender: string, note: string) => void;
  addTransaction: (transaction: Transaction) => void;
  getTransactionHistory: () => Transaction[];
  setSelectedWallet: (walletId: string) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  balance: CURRENT_USER.walletBalance,
  transactions: TRANSACTIONS,
  selectedWallet: "wdk-main",
  qrCodePlaceholder: `user-${Date.now()}`,

  send: (amount, recipient, note) =>
    set((state) => {
      if (amount > state.balance) {
        console.warn("Insufficient balance");
        return state;
      }
      const newTransaction: Transaction = {
        id: `t-${Date.now()}`,
        type: "out",
        amount,
        party: recipient,
        note,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      return {
        balance: state.balance - amount,
        transactions: [...state.transactions, newTransaction],
      };
    }),

  receive: (amount, sender, note) =>
    set((state) => {
      const newTransaction: Transaction = {
        id: `t-${Date.now()}`,
        type: "in",
        amount,
        party: sender,
        note,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      return {
        balance: state.balance + amount,
        transactions: [...state.transactions, newTransaction],
      };
    }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction],
      balance:
        state.balance +
        (transaction.type === "in" ? transaction.amount : -transaction.amount),
    })),

  getTransactionHistory: () => get().transactions,

  setSelectedWallet: (walletId) => set({ selectedWallet: walletId }),
}));

// Selectors
export const selectBalance = (state: WalletStore) => state.balance;
export const selectTransactions = (state: WalletStore) => state.transactions;
export const selectSelectedWallet = (state: WalletStore) =>
  state.selectedWallet;
export const selectQRCode = (state: WalletStore) => state.qrCodePlaceholder;
export const selectIncome = (state: WalletStore) =>
  state.transactions
    .filter((t) => t.type === "in")
    .reduce((sum, t) => sum + t.amount, 0);
export const selectExpenses = (state: WalletStore) =>
  state.transactions
    .filter((t) => t.type === "out")
    .reduce((sum, t) => sum + t.amount, 0);
