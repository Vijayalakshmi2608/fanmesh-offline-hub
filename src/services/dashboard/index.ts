import type { DashboardStats } from "@/types";
import {
  CURRENT_USER,
  CURRENT_STADIUM,
  NOTIFICATIONS,
  TODAY_MATCH,
  TRANSACTIONS,
  FANS,
  SUMMARIES,
  MESH_ACTIVITY,
  TOP_NATIONALITIES,
} from "@/mock";
import { cloneMock, withMockLatency } from "../mockLatency";

export const DashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    return withMockLatency(() => ({
      currentUser: cloneMock(CURRENT_USER),
      currentStadium: cloneMock(CURRENT_STADIUM),
      todaysMatch: cloneMock(TODAY_MATCH),
      metrics: [
        { label: "Nearby Fans", value: String(FANS.slice(0, 24).length), hint: "+5 since arrival", icon: "Users", accent: "bg-primary" },
        { label: "Messages", value: "142", hint: "12 unread", icon: "MessageCircle", accent: "bg-primary" },
        { label: "Alerts", value: "3", hint: "1 high priority", icon: "Siren", accent: "bg-destructive" },
        { label: "Wallet", value: `$${CURRENT_USER.walletBalance.toFixed(0)}`, hint: "+$48 today", icon: "Wallet", accent: "bg-primary" },
        { label: "Listings", value: "6", hint: "2 active offers", icon: "ShoppingBag", accent: "bg-primary" },
        { label: "AI Insights", value: String(SUMMARIES.length), hint: "updated 2m ago", icon: "Sparkles", accent: "bg-primary" },
      ],
      nearbyFans: cloneMock(FANS.slice(0, 24)),
      notifications: cloneMock(NOTIFICATIONS),
      transactions: cloneMock(TRANSACTIONS),
      meshActivity: cloneMock(MESH_ACTIVITY),
      topNationalities: cloneMock(TOP_NATIONALITIES),
    }));
  },
};
