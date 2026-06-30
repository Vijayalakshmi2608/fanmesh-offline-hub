import type { AppNotification } from "@/types";
import { NOTIFICATIONS } from "@/mock";
import { cloneMock, withMockLatency } from "../mockLatency";

let notifications = cloneMock(NOTIFICATIONS);

export const NotificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    return withMockLatency(() => cloneMock(notifications));
  },

  async getGroupedNotifications(): Promise<Record<AppNotification["group"], AppNotification[]>> {
    return withMockLatency(() => {
      const grouped: Record<AppNotification["group"], AppNotification[]> = {
        Marketplace: [],
        Chat: [],
        Emergency: [],
        Wallet: [],
        Nearby: [],
      };

      notifications.forEach((notification) => {
        grouped[notification.group].push(notification);
      });

      return cloneMock(grouped);
    });
  },
};
