// Centralized mock data for FanMesh AI. Replace with real adapters
// (Pears Stack / QVAC SDK / WDK) when integrating the backend.

export type Fan = {
  id: string;
  name: string;
  username: string;
  country: string;
  flag: string;
  team: string;
  distance: number; // meters
  signal: number; // 0-100
  languages: string[];
  avatar: string;
  online: boolean;
};

export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  pinned?: boolean;
  typing?: boolean;
  translated?: boolean;
};

export type Message = {
  id: string;
  conversationId: string;
  author: "me" | "them";
  text: string;
  time: string;
  type?: "text" | "voice" | "image";
  reactions?: string[];
  translated?: boolean;
};

export type Product = {
  id: string;
  title: string;
  category: "Tickets" | "Jerseys" | "Scarves" | "Food Coupons" | "Collectibles";
  price: number;
  currency: string;
  condition: "New" | "Like New" | "Used";
  rating: number;
  seller: string;
  sellerAvatar: string;
  image: string;
  images?: string[];
  description: string;
};

export type Alert = {
  id: string;
  category: "Medical" | "Security" | "Fire" | "Weather" | "Crowd";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  time: string;
  location: string;
};

export type Transaction = {
  id: string;
  type: "in" | "out";
  amount: number;
  party: string;
  note: string;
  time: string;
};

export type Summary = {
  id: string;
  icon: string;
  title: string;
  detail: string;
  priority: "low" | "medium" | "high";
  time: string;
};

export type AppNotification = {
  id: string;
  group: "Marketplace" | "Chat" | "Emergency" | "Wallet" | "Nearby";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const NATIONS: { country: string; flag: string }[] = [
  { country: "Brazil", flag: "🇧🇷" }, { country: "Argentina", flag: "🇦🇷" },
  { country: "Germany", flag: "🇩🇪" }, { country: "France", flag: "🇫🇷" },
  { country: "Spain", flag: "🇪🇸" }, { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { country: "Portugal", flag: "🇵🇹" }, { country: "Netherlands", flag: "🇳🇱" },
  { country: "Italy", flag: "🇮🇹" }, { country: "Belgium", flag: "🇧🇪" },
  { country: "Croatia", flag: "🇭🇷" }, { country: "Uruguay", flag: "🇺🇾" },
  { country: "Mexico", flag: "🇲🇽" }, { country: "USA", flag: "🇺🇸" },
  { country: "Japan", flag: "🇯🇵" }, { country: "South Korea", flag: "🇰🇷" },
  { country: "Senegal", flag: "🇸🇳" }, { country: "Morocco", flag: "🇲🇦" },
  { country: "Ghana", flag: "🇬🇭" }, { country: "Nigeria", flag: "🇳🇬" },
  { country: "Cameroon", flag: "🇨🇲" }, { country: "Egypt", flag: "🇪🇬" },
  { country: "Saudi Arabia", flag: "🇸🇦" }, { country: "Qatar", flag: "🇶🇦" },
  { country: "Australia", flag: "🇦🇺" }, { country: "Canada", flag: "🇨🇦" },
  { country: "Switzerland", flag: "🇨🇭" }, { country: "Denmark", flag: "🇩🇰" },
  { country: "Poland", flag: "🇵🇱" }, { country: "Serbia", flag: "🇷🇸" },
  { country: "Ecuador", flag: "🇪🇨" }, { country: "Costa Rica", flag: "🇨🇷" },
];

export const NATIONS_LIST = NATIONS;

const TEAMS = [
  "Real Madrid", "Barcelona", "Man City", "Liverpool", "Bayern", "PSG",
  "Juventus", "Inter", "Milan", "Arsenal", "Chelsea", "Atletico", "Dortmund",
  "Napoli", "Flamengo", "Boca Juniors", "Ajax", "Porto", "Benfica",
];

const LANGS = ["English", "Spanish", "Portuguese", "French", "German", "Arabic", "Italian", "Japanese", "Dutch", "Korean"];

const FIRST = ["Lucas", "Ahmed", "Marco", "Hiroshi", "Liam", "Diego", "Noah", "Ali", "Ethan", "Yuki", "Karim", "Mateo", "Leo", "Omar", "Felipe", "Kai", "Jonas", "Mohamed", "Sergio", "Andrei"];
const LAST = ["Silva", "Müller", "Tanaka", "Smith", "Garcia", "Rossi", "Dubois", "Khan", "Hassan", "Costa", "Park", "Nguyen", "Petrov", "Schmidt", "Lopez"];

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(a: T[]) => a[rand(a.length)];

// Seeded random so values are stable across SSR/CSR
let seed = 42;
const sr = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};
const sPick = <T,>(a: T[]) => a[Math.floor(sr() * a.length)];
const sInt = (n: number) => Math.floor(sr() * n);

export const FANS: Fan[] = Array.from({ length: 50 }, (_, i) => {
  const n = sPick(NATIONS);
  const fn = sPick(FIRST);
  const ln = sPick(LAST);
  return {
    id: `fan-${i}`,
    name: `${fn} ${ln}`,
    username: `@${fn.toLowerCase()}${sInt(999)}`,
    country: n.country,
    flag: n.flag,
    team: sPick(TEAMS),
    distance: 5 + sInt(295),
    signal: 30 + sInt(70),
    languages: Array.from(new Set([sPick(LANGS), sPick(LANGS)])),
    avatar: `https://i.pravatar.cc/150?u=fan-${i}`,
    online: sr() > 0.25,
  };
});

export const CONVERSATIONS: Conversation[] = FANS.slice(0, 12).map((f, i) => ({
  id: `c-${i}`,
  name: f.name,
  avatar: f.avatar,
  lastMessage: sPick([
    "What a goal! 🔥", "Where are you sitting?", "Meet at Gate 5?",
    "Translated from Spanish", "Did you see that save!", "Selling 2 tickets",
    "On my way 🏃", "GOAAAL!!!", "Half time already?",
  ]),
  time: `${sInt(59) + 1}m`,
  unread: sr() > 0.55 ? sInt(8) + 1 : 0,
  pinned: i < 2,
  typing: i === 0,
  translated: sr() > 0.6,
}));

export const MESSAGES: Message[] = Array.from({ length: 200 }, (_, i) => {
  const cid = `c-${i % 12}`;
  return {
    id: `m-${i}`,
    conversationId: cid,
    author: sr() > 0.5 ? "me" : "them",
    text: sPick([
      "Did you see that pass?!", "Meeting at the south gate",
      "Selling jersey, size M", "GOOOOAL 🔥⚽", "I'm near section B12",
      "Anyone speak Portuguese?", "Heat is intense today",
      "Free food coupon, DM me", "Lost my friend, anyone seen him?",
      "Score is 2-1!", "Bro this stadium is electric",
      "Need a translator for Spanish 🙏",
    ]),
    time: `${sInt(23)}:${String(sInt(59)).padStart(2, "0")}`,
    type: sr() > 0.9 ? "voice" : sr() > 0.85 ? "image" : "text",
    reactions: sr() > 0.7 ? [sPick(["🔥", "⚽", "👏", "❤️", "😂"])] : undefined,
    translated: sr() > 0.7,
  };
});

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
  "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600",
  "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=600",
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600",
  "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=600",
  "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600",
  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600",
];

const CATS: Product["category"][] = ["Tickets", "Jerseys", "Scarves", "Food Coupons", "Collectibles"];

export const PRODUCTS: Product[] = Array.from({ length: 30 }, (_, i) => {
  const cat = sPick(CATS);
  return {
    id: `p-${i}`,
    title: `${cat === "Jerseys" ? sPick(TEAMS) + " Home Jersey" :
            cat === "Tickets" ? `VIP Ticket Sec ${sInt(120) + 100}` :
            cat === "Scarves" ? `${sPick(TEAMS)} Fan Scarf` :
            cat === "Food Coupons" ? `Stadium Snack Bundle` :
            `Limited Edition ${sPick(TEAMS)} Pin`}`,
    category: cat,
    price: 10 + sInt(490),
    currency: "USD",
    condition: sPick(["New", "Like New", "Used"]),
    rating: 3 + Math.round(sr() * 20) / 10,
    seller: `${sPick(FIRST)} ${sPick(LAST)}`,
    sellerAvatar: `https://i.pravatar.cc/100?u=seller-${i}`,
    image: PRODUCT_IMAGES[i % PRODUCT_IMAGES.length],
    images: [PRODUCT_IMAGES[i % PRODUCT_IMAGES.length], PRODUCT_IMAGES[(i + 1) % PRODUCT_IMAGES.length], PRODUCT_IMAGES[(i + 2) % PRODUCT_IMAGES.length]],
    description: "Authentic stadium item from a verified seller. Pickup at Gate 3 or in-app delivery via FanMesh nearby relay.",
  };
});

export const ALERTS: Alert[] = Array.from({ length: 20 }, (_, i) => {
  const cat = sPick(["Medical", "Security", "Fire", "Weather", "Crowd"] as Alert["category"][]);
  return {
    id: `a-${i}`,
    category: cat,
    priority: sPick(["low", "medium", "high", "critical"] as Alert["priority"][]),
    title: {
      Medical: "Medical team on standby",
      Security: "Suspicious activity reported",
      Fire: "Smoke detected near concessions",
      Weather: "Heat advisory in effect",
      Crowd: "Congestion at gate",
    }[cat],
    message: "Stay alert. Follow stewards' instructions. Local mesh broadcast active.",
    time: `${sInt(59) + 1}m ago`,
    location: `Sector ${sPick(["A", "B", "C", "D"])}${sInt(20) + 1}`,
  };
});

export const TRANSACTIONS: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
  id: `t-${i}`,
  type: sr() > 0.5 ? "in" : "out",
  amount: Math.round(sr() * 240 + 5),
  party: `${sPick(FIRST)} ${sPick(LAST)}`,
  note: sPick(["Jersey", "Ticket resale", "Snack bundle", "Mesh tip", "Scarf", "Refund", "VIP upgrade"]),
  time: `${sInt(23)}:${String(sInt(59)).padStart(2, "0")}`,
}));

export const SUMMARIES: Summary[] = [
  { id: "s1", icon: "Users", title: "Gate 5 crowded", detail: "Estimated 12-min wait. Try Gate 7.", priority: "high", time: "2m" },
  { id: "s2", icon: "Utensils", title: "Food queue short", detail: "Concession C-14 under 2 min wait.", priority: "low", time: "4m" },
  { id: "s3", icon: "DoorOpen", title: "Entrance B busy", detail: "Heavy flow incoming, expect delays.", priority: "medium", time: "5m" },
  { id: "s4", icon: "HeartPulse", title: "Medical team nearby", detail: "Mobile unit by Section D7.", priority: "medium", time: "6m" },
  { id: "s5", icon: "Shield", title: "Security notice", detail: "Bag check active at North entry.", priority: "medium", time: "7m" },
  { id: "s6", icon: "ThermometerSun", title: "Heat warning", detail: "Hydration stations open at C2, A9.", priority: "high", time: "8m" },
  ...Array.from({ length: 19 }, (_, i) => ({
    id: `s-${i + 7}`,
    icon: sPick(["Users", "Utensils", "Shield", "DoorOpen", "ThermometerSun", "HeartPulse"]),
    title: sPick(["Vendor opened", "Restroom queue cleared", "Press box update", "Fan zone packed", "Souvenir stall busy"]),
    detail: "Updated via local AI summary mesh broadcast.",
    priority: sPick(["low", "medium", "high"] as Summary["priority"][]),
    time: `${sInt(30) + 1}m`,
  })),
];

export const NOTIFICATIONS: AppNotification[] = Array.from({ length: 20 }, (_, i) => {
  const group = sPick(["Marketplace", "Chat", "Emergency", "Wallet", "Nearby"] as AppNotification["group"][]);
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
    time: `${sInt(59) + 1}m`,
    read: sr() > 0.6,
  };
});

export const STADIUM_SECTIONS = Array.from({ length: 12 }, (_, i) => ({
  id: `sec-${i}`,
  label: `Sec ${String.fromCharCode(65 + (i % 4))}${i + 1}`,
  density: Math.round(sr() * 100),
}));

export const CURRENT_USER = {
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

export const TODAY_MATCH = {
  home: { name: "Real Madrid", flag: "⚪", logo: "RM" },
  away: { name: "Barcelona", flag: "🔴", logo: "FCB" },
  stadium: "Santiago Bernabéu",
  kickoff: "21:00 CET",
  countdownMs: 1000 * 60 * 60 * 4 + 1000 * 60 * 23,
};

export { rand, pick };
