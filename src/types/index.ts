/**
 * Comprehensive types for FanMesh AI application
 * Organized by domain for better maintainability
 */

// ============================================================================
// User Domain
// ============================================================================

export type UserProfile = {
  id: string;
  name: string;
  username: string;
  country: string;
  flag: string;
  favouriteTeam: string;
  avatar: string;
  preferredLanguage: string;
  online: boolean;
};

export type NotificationSettings = {
  emergencyAlerts: boolean;
  chatMessages: boolean;
  marketplaceOffers: boolean;
  walletActivity: boolean;
};

export type Theme = "dark" | "light" | "system";

export type UserState = {
  profile: UserProfile;
  notificationSettings: NotificationSettings;
  theme: Theme;
  language: string;
};

// ============================================================================
// Chat Domain
// ============================================================================

export type Fan = {
  id: string;
  name: string;
  username: string;
  country: string;
  flag: string;
  team: string;
  distance: number;
  signal: number;
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

export type ChatAttachment = {
  id: string;
  type: "image" | "voice" | "file";
  url: string;
  name: string;
};

// ============================================================================
// Marketplace Domain
// ============================================================================

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

export type CartItem = {
  productId: string;
  quantity: number;
};

// ============================================================================
// Wallet Domain
// ============================================================================

export type Transaction = {
  id: string;
  type: "in" | "out";
  amount: number;
  party: string;
  note: string;
  time: string;
};

// ============================================================================
// Emergency & Alerts Domain
// ============================================================================

export type Alert = {
  id: string;
  category: "Medical" | "Security" | "Fire" | "Weather" | "Crowd";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  time: string;
  location: string;
};

// ============================================================================
// Notifications Domain
// ============================================================================

export type AppNotification = {
  id: string;
  group: "Marketplace" | "Chat" | "Emergency" | "Wallet" | "Nearby";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

// ============================================================================
// Stadium Domain
// ============================================================================

export type StadiumSection = {
  id: string;
  label: string;
  density: number; // 0-100%
};

export type StadiumInfo = {
  name: string;
  city: string;
  teams?: string[];
};

// ============================================================================
// Translation Domain
// ============================================================================

export type TranslationHistoryItem = {
  id: string;
  original: string;
  translated: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
};

// ============================================================================
// Settings Domain
// ============================================================================

export type SettingsState = {
  darkMode: boolean;
  language: string;
  downloadsEnabled: boolean;
  offlineMode: boolean;
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
  };
};
