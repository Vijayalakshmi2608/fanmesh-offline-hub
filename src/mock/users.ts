import type { CurrentUser, Fan } from "@/types";
import { createSeededRandom, FIRST_NAMES, LAST_NAMES, LANGS, NATIONS, TEAMS, pick } from "./shared";

const random = createSeededRandom(42);

export const CURRENT_USER: CurrentUser = {
  name: "Alex Morgan",
  username: "@alex",
  country: "Spain",
  flag: "🇪🇸",
  team: "Real Madrid",
  language: "English",
  avatar: "https://i.pravatar.cc/200?u=me",
  walletBalance: 1248.55,
  achievements: ["First Mesh", "100 Translations", "Verified Fan", "Top Seller"],
};

export const FANS: Fan[] = Array.from({ length: 50 }, (_, i) => {
  const nation = pick(NATIONS, random);
  const first = pick(FIRST_NAMES, random);
  const last = pick(LAST_NAMES, random);

  return {
    id: `fan-${i}`,
    name: `${first} ${last}`,
    username: `@${first.toLowerCase()}${Math.floor(random() * 999)}`,
    country: nation.country,
    flag: nation.flag,
    team: pick(TEAMS, random),
    distance: 5 + Math.floor(random() * 295),
    signal: 30 + Math.floor(random() * 70),
    languages: Array.from(new Set([pick(LANGS, random), pick(LANGS, random)])),
    avatar: `https://i.pravatar.cc/150?u=fan-${i}`,
    online: random() > 0.25,
  };
});
