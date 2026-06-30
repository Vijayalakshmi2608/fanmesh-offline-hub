/**
 * Central export point for all Zustand stores
 * Import stores from this file for consistency
 */

export { useUserStore, selectUserProfile, selectTheme, selectLanguage } from "./useUserStore";
export type { } from "./useUserStore";

export {
  useChatStore,
  selectConversations,
  selectSelectedConversation,
  selectMessages,
  selectDraftMessage,
} from "./useChatStore";

export {
  useNearbyFansStore,
  selectNearbyUsers,
  selectConnectedPeers,
  selectDiscoveryEnabled,
} from "./useNearbyFansStore";

export {
  useMarketplaceStore,
  selectProducts,
  selectSelectedCategory,
  selectSearchQuery,
  selectWishlist,
  selectCart,
  selectCartTotal,
} from "./useMarketplaceStore";

export {
  useWalletStore,
  selectBalance,
  selectTransactions,
  selectIncome,
  selectExpenses,
} from "./useWalletStore";

export {
  useEmergencyAlertsStore,
  selectAlerts,
  selectActiveAlerts,
  selectUnreadCount,
} from "./useEmergencyAlertsStore";

export {
  useNotificationStore,
  selectNotifications,
  selectUnreadNotifications,
} from "./useNotificationStore";

export {
  useStadiumStore,
  selectSelectedStadium,
  selectStadiumSections,
  selectHighDensitySections,
} from "./useStadiumStore";

export {
  useTranslationStore,
  selectOriginalText,
  selectTranslatedText,
  selectSourceLanguage,
  selectTargetLanguage,
  selectTranslationHistory,
} from "./useTranslationStore";

export {
  useSettingsStore,
  selectDarkMode,
  selectLanguage as selectSettingsLanguage,
  selectAccessibility,
} from "./useSettingsStore";
