import type { DashboardMetric, MeshActivityPoint, TopNationality } from "@/types";
import { createSeededRandom, pick } from "./shared";

const random = createSeededRandom(49);

export const DASHBOARD_METRICS: DashboardMetric[] = [
  { label: "Nearby Fans", value: "24", hint: "+5 since arrival", icon: "Users", accent: "bg-primary" },
  { label: "Messages", value: "142", hint: "12 unread", icon: "MessageCircle", accent: "bg-primary" },
  { label: "Alerts", value: "3", hint: "1 high priority", icon: "Siren", accent: "bg-destructive" },
  { label: "Wallet", value: "$1248", hint: "+$48 today", icon: "Wallet", accent: "bg-primary" },
  { label: "Listings", value: "6", hint: "2 active offers", icon: "ShoppingBag", accent: "bg-primary" },
  { label: "AI Insights", value: "25", hint: "updated 2m ago", icon: "Sparkles", accent: "bg-primary" },
];

export const MESH_ACTIVITY: MeshActivityPoint[] = Array.from({ length: 12 }, (_, i) => ({
  name: `${i + 9}:00`,
  fans: 80 + Math.round(Math.sin(i / 2) * 30 + random() * 25),
  msgs: 40 + Math.round(Math.cos(i / 3) * 25 + random() * 30),
}));

export const TOP_NATIONALITIES: TopNationality[] = [
  { code: "BR", value: 22 },
  { code: "ES", value: 19 },
  { code: "AR", value: 15 },
  { code: "DE", value: 12 },
  { code: "FR", value: 9 },
  { code: "JP", value: 7 },
];
