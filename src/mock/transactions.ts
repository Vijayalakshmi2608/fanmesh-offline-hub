import type { Transaction } from "@/types";
import { createSeededRandom, FIRST_NAMES, LAST_NAMES, pick } from "./shared";

const random = createSeededRandom(45);

export const TRANSACTIONS: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
  id: `t-${i}`,
  type: random() > 0.5 ? "in" : "out",
  amount: Math.round(random() * 240 + 5),
  party: `${pick(FIRST_NAMES, random)} ${pick(LAST_NAMES, random)}`,
  note: pick(["Jersey", "Ticket resale", "Snack bundle", "Mesh tip", "Scarf", "Refund", "VIP upgrade"], random),
  time: `${Math.floor(random() * 23)}:${String(Math.floor(random() * 59)).padStart(2, "0")}`,
}));
