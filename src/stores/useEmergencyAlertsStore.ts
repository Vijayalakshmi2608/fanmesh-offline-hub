import { create } from "zustand";
import { Alert } from "@/types";
import { ALERTS } from "@/lib/mock-data";

interface EmergencyAlertsStore {
  alerts: Alert[];
  unreadAlerts: Set<string>;
  activeAlerts: Alert[];

  addAlert: (alert: Alert) => void;
  dismissAlert: (alertId: string) => void;
  markAsRead: (alertId: string) => void;
  getUnreadCount: () => number;
  getActiveAlerts: () => Alert[];
  clearOldAlerts: (olderThanMinutes: number) => void;
}

export const useEmergencyAlertsStore = create<EmergencyAlertsStore>((set, get) => ({
  alerts: ALERTS,
  unreadAlerts: new Set<string>(ALERTS.map((a) => a.id)),
  activeAlerts: ALERTS.filter((a) => a.priority !== "low"),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      unreadAlerts: new Set([...state.unreadAlerts, alert.id]),
      activeAlerts:
        alert.priority !== "low"
          ? [alert, ...state.activeAlerts]
          : state.activeAlerts,
    })),

  dismissAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
      activeAlerts: state.activeAlerts.filter((a) => a.id !== alertId),
      unreadAlerts: new Set(
        [...state.unreadAlerts].filter((id) => id !== alertId)
      ),
    })),

  markAsRead: (alertId) =>
    set((state) => {
      const newUnread = new Set(state.unreadAlerts);
      newUnread.delete(alertId);
      return { unreadAlerts: newUnread };
    }),

  getUnreadCount: () => get().unreadAlerts.size,

  getActiveAlerts: () => get().activeAlerts,

  clearOldAlerts: (olderThanMinutes) =>
    set((state) => {
      const cutoffTime = Date.now() - olderThanMinutes * 60 * 1000;
      // This is a simplified implementation since our mock data doesn't have timestamps
      // In production, parse alert.time and compare
      return state;
    }),
}));

// Selectors
export const selectAlerts = (state: EmergencyAlertsStore) => state.alerts;
export const selectUnreadAlerts = (state: EmergencyAlertsStore) =>
  state.alerts.filter((a) => state.unreadAlerts.has(a.id));
export const selectActiveAlerts = (state: EmergencyAlertsStore) =>
  state.activeAlerts;
export const selectUnreadCount = (state: EmergencyAlertsStore) =>
  state.unreadAlerts.size;
export const selectAlertsByCriticality = (state: EmergencyAlertsStore) => {
  return {
    critical: state.alerts.filter((a) => a.priority === "critical"),
    high: state.alerts.filter((a) => a.priority === "high"),
    medium: state.alerts.filter((a) => a.priority === "medium"),
    low: state.alerts.filter((a) => a.priority === "low"),
  };
};
