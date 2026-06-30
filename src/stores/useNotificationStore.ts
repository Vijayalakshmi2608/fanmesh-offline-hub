import { create } from "zustand";
import { AppNotification } from "@/types";
import { NOTIFICATIONS } from "@/lib/mock-data";

interface NotificationStore {
  notifications: AppNotification[];
  unreadCount: number;

  addNotification: (notification: Omit<AppNotification, "id" | "read">) => void;
  removeNotification: (notificationId: string) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  getUnreadCount: () => number;
  getGroupedNotifications: () => Record<string, AppNotification[]>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: NOTIFICATIONS,
  unreadCount: NOTIFICATIONS.filter((n) => !n.read).length,

  addNotification: (notification) =>
    set((state) => {
      const newNotification: AppNotification = {
        ...notification,
        id: `n-${Date.now()}`,
        read: false,
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),

  removeNotification: (notificationId) =>
    set((state) => {
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      return {
        notifications: state.notifications.filter(
          (n) => n.id !== notificationId
        ),
        unreadCount:
          state.unreadCount - (notification && !notification.read ? 1 : 0),
      };
    }),

  markAsRead: (notificationId) =>
    set((state) => {
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      if (!notification || notification.read) return state;

      return {
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  getUnreadCount: () => get().unreadCount,

  getGroupedNotifications: () => {
    const state = get();
    const grouped: Record<string, AppNotification[]> = {
      Marketplace: [],
      Chat: [],
      Emergency: [],
      Wallet: [],
      Nearby: [],
    };

    state.notifications.forEach((notif) => {
      if (grouped[notif.group]) {
        grouped[notif.group].push(notif);
      }
    });

    return grouped;
  },
}));

// Selectors
export const selectNotifications = (state: NotificationStore) =>
  state.notifications;
export const selectUnreadNotifications = (state: NotificationStore) =>
  state.notifications.filter((n) => !n.read);
export const selectUnreadCount = (state: NotificationStore) =>
  state.unreadCount;
export const selectNotificationsByGroup = (group: string) => (state: NotificationStore) =>
  state.notifications.filter((n) => n.group === group);
