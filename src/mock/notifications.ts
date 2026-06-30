import type { AppNotification } from "@/types";
import { createSeededRandom, pick } from "./shared";

const random = createSeededRandom(47);

export const NOTIFICATIONS: AppNotification[] = Array.from({ length: 20 }, (_, i) => {
  const group = pick(["Marketplace", "Chat", "Emergency", "Wallet", "Nearby"] as const, random);

  return {
    id: `n-${i}`,
    group,
    title: {
      Marketplace: "New offer on your listing",
      Chat: "New message from a nearby fan",
      Emergency: "Local alert broadcast",
      Wallet: "Payment received",
      Nearby: "New fan joined your mesh",
    }[group],
    body: "Tap to view details inside FanMesh AI.",
    time: `${Math.floor(random() * 59) + 1}m`,
    read: random() > 0.6,
  };
});
