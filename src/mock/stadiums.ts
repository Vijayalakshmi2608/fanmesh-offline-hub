import type { MatchInfo, StadiumInfo, StadiumSection, Summary } from "@/types";
import { createSeededRandom, pick } from "./shared";

const random = createSeededRandom(48);

export const STADIUM_SECTIONS: StadiumSection[] = Array.from({ length: 12 }, (_, i) => ({
  id: `sec-${i}`,
  label: `Sec ${String.fromCharCode(65 + (i % 4))}${i + 1}`,
  density: Math.round(random() * 100),
}));

export const CURRENT_STADIUM: StadiumInfo = {
  name: "Santiago Bernabéu",
  city: "Madrid",
  teams: ["Real Madrid"],
};

export const TODAY_MATCH: MatchInfo = {
  home: { name: "Real Madrid", flag: "⚪", logo: "RM" },
  away: { name: "Barcelona", flag: "🔴", logo: "FCB" },
  stadium: "Santiago Bernabéu",
  kickoff: "21:00 CET",
  countdownMs: 1000 * 60 * 60 * 4 + 1000 * 60 * 23,
};

export const SUMMARIES: Summary[] = [
  { id: "s1", icon: "Users", title: "Gate 5 crowded", detail: "Estimated 12-min wait. Try Gate 7.", priority: "high", time: "2m" },
  { id: "s2", icon: "Utensils", title: "Food queue short", detail: "Concession C-14 under 2 min wait.", priority: "low", time: "4m" },
  { id: "s3", icon: "DoorOpen", title: "Entrance B busy", detail: "Heavy flow incoming, expect delays.", priority: "medium", time: "5m" },
  { id: "s4", icon: "HeartPulse", title: "Medical team nearby", detail: "Mobile unit by Section D7.", priority: "medium", time: "6m" },
  { id: "s5", icon: "Shield", title: "Security notice", detail: "Bag check active at North entry.", priority: "medium", time: "7m" },
  { id: "s6", icon: "ThermometerSun", title: "Heat warning", detail: "Hydration stations open at C2, A9.", priority: "high", time: "8m" },
  ...Array.from({ length: 19 }, (_, i) => ({
    id: `s-${i + 7}`,
    icon: pick(["Users", "Utensils", "Shield", "DoorOpen", "ThermometerSun", "HeartPulse"] as const, random),
    title: pick(["Vendor opened", "Restroom queue cleared", "Press box update", "Fan zone packed", "Souvenir stall busy"] as const, random),
    detail: "Updated via local AI summary mesh broadcast.",
    priority: pick(["low", "medium", "high"] as const, random),
    time: `${Math.floor(random() * 30) + 1}m`,
  })),
];
