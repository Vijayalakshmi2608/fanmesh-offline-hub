export const NATIONS = [
  { country: "Brazil", flag: "🇧🇷" },
  { country: "Argentina", flag: "🇦🇷" },
  { country: "Germany", flag: "🇩🇪" },
  { country: "France", flag: "🇫🇷" },
  { country: "Spain", flag: "🇪🇸" },
  { country: "England", flag: "🏴" },
  { country: "Portugal", flag: "🇵🇹" },
  { country: "Netherlands", flag: "🇳🇱" },
  { country: "Italy", flag: "🇮🇹" },
  { country: "Belgium", flag: "🇧🇪" },
  { country: "Croatia", flag: "🇭🇷" },
  { country: "Uruguay", flag: "🇺🇾" },
  { country: "Mexico", flag: "🇲🇽" },
  { country: "USA", flag: "🇺🇸" },
  { country: "Japan", flag: "🇯🇵" },
  { country: "South Korea", flag: "🇰🇷" },
  { country: "Senegal", flag: "🇸🇳" },
  { country: "Morocco", flag: "🇲🇦" },
  { country: "Ghana", flag: "🇬🇭" },
  { country: "Nigeria", flag: "🇳🇬" },
  { country: "Cameroon", flag: "🇨🇲" },
  { country: "Egypt", flag: "🇪🇬" },
  { country: "Saudi Arabia", flag: "🇸🇦" },
  { country: "Qatar", flag: "🇶🇦" },
  { country: "Australia", flag: "🇦🇺" },
  { country: "Canada", flag: "🇨🇦" },
  { country: "Switzerland", flag: "🇨🇭" },
  { country: "Denmark", flag: "🇩🇰" },
  { country: "Poland", flag: "🇵🇱" },
  { country: "Serbia", flag: "🇷🇸" },
  { country: "Ecuador", flag: "🇪🇨" },
  { country: "Costa Rica", flag: "🇨🇷" },
] as const;

export const TEAMS = [
  "Real Madrid",
  "Barcelona",
  "Man City",
  "Liverpool",
  "Bayern",
  "PSG",
  "Juventus",
  "Inter",
  "Milan",
  "Arsenal",
  "Chelsea",
  "Atletico",
  "Dortmund",
  "Napoli",
  "Flamengo",
  "Boca Juniors",
  "Ajax",
  "Porto",
  "Benfica",
] as const;

export const LANGS = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "German",
  "Arabic",
  "Italian",
  "Japanese",
  "Dutch",
  "Korean",
] as const;

export const FIRST_NAMES = [
  "Lucas",
  "Ahmed",
  "Marco",
  "Hiroshi",
  "Liam",
  "Diego",
  "Noah",
  "Ali",
  "Ethan",
  "Yuki",
  "Karim",
  "Mateo",
  "Leo",
  "Omar",
  "Felipe",
  "Kai",
  "Jonas",
  "Mohamed",
  "Sergio",
  "Andrei",
] as const;

export const LAST_NAMES = [
  "Silva",
  "Müller",
  "Tanaka",
  "Smith",
  "Garcia",
  "Rossi",
  "Dubois",
  "Khan",
  "Hassan",
  "Costa",
  "Park",
  "Nguyen",
  "Petrov",
  "Schmidt",
  "Lopez",
] as const;

export const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
  "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600",
  "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=600",
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600",
  "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=600",
  "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600",
  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600",
] as const;

export const TRANSLATION_RECENT = [
  { from: "ES", to: "EN", src: "¡Vamos equipo!", out: "Let's go team!" },
  { from: "PT", to: "EN", src: "Onde fica a saÃ­da?", out: "Where is the exit?" },
  { from: "FR", to: "EN", src: "Quel beau but!", out: "What a beautiful goal!" },
  { from: "JA", to: "EN", src: "席はどこですか？", out: "Where is my seat?" },
] as const;

export function createSeededRandom(seed = 42) {
  let current = seed;
  return () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };
}

export function pick<T>(items: readonly T[], random: () => number) {
  return items[Math.floor(random() * items.length)];
}

export function toSentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
