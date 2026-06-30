import type { Conversation, Message } from "@/types";
import { createSeededRandom, FIRST_NAMES, LAST_NAMES, LANGS, NATIONS, TEAMS, pick } from "./shared";
import { FANS } from "./users";

const random = createSeededRandom(43);

export const CONVERSATIONS: Conversation[] = FANS.slice(0, 12).map((fan, i) => ({
  id: `c-${i}`,
  name: fan.name,
  avatar: fan.avatar,
  lastMessage: pick(
    [
      "What a goal! 🔥",
      "Where are you sitting?",
      "Meet at Gate 5?",
      "Translated from Spanish",
      "Did you see that save!",
      "Selling 2 tickets",
      "On my way 🏃",
      "GOAAAL!!!",
      "Half time already?",
    ],
    random,
  ),
  time: `${Math.floor(random() * 59) + 1}m`,
  unread: random() > 0.55 ? Math.floor(random() * 8) + 1 : 0,
  pinned: i < 2,
  typing: i === 0,
  translated: random() > 0.6,
}));

export const MESSAGES: Message[] = Array.from({ length: 200 }, (_, i) => ({
  id: `m-${i}`,
  conversationId: `c-${i % 12}`,
  author: random() > 0.5 ? "me" : "them",
  text: pick(
    [
      "Did you see that pass?!",
      "Meeting at the south gate",
      "Selling jersey, size M",
      "GOOOOAL 🔥⚽",
      "I'm near section B12",
      "Anyone speak Portuguese?",
      "Heat is intense today",
      "Free food coupon, DM me",
      "Lost my friend, anyone seen him?",
      "Score is 2-1!",
      "Bro this stadium is electric",
      "Need a translator for Spanish 🙏",
    ],
    random,
  ),
  time: `${Math.floor(random() * 23)}:${String(Math.floor(random() * 59)).padStart(2, "0")}`,
  type: random() > 0.9 ? "voice" : random() > 0.85 ? "image" : "text",
  reactions: random() > 0.7 ? [pick(["🔥", "⚽", "👏", "❤️", "😂"], random)] : undefined,
  translated: random() > 0.7,
}));
