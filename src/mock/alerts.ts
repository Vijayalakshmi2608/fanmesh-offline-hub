import type { Alert } from "@/types";
import { createSeededRandom, pick } from "./shared";

const random = createSeededRandom(46);

export const ALERTS: Alert[] = Array.from({ length: 20 }, (_, i) => {
  const category = pick(["Medical", "Security", "Fire", "Weather", "Crowd"] as const, random);

  return {
    id: `a-${i}`,
    category,
    priority: pick(["low", "medium", "high", "critical"] as const, random),
    title: {
      Medical: "Medical team on standby",
      Security: "Suspicious activity reported",
      Fire: "Smoke detected near concessions",
      Weather: "Heat advisory in effect",
      Crowd: "Congestion at gate",
    }[category],
    message: "Stay alert. Follow stewards' instructions. Local mesh broadcast active.",
    time: `${Math.floor(random() * 59) + 1}m ago`,
    location: `Sector ${pick(["A", "B", "C", "D"] as const, random)}${Math.floor(random() * 20) + 1}`,
  };
});
