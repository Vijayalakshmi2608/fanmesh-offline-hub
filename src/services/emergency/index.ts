import type { Alert } from "@/types";
import { ALERTS } from "@/mock";
import { cloneMock, withMockLatency } from "../mockLatency";

let alerts = cloneMock(ALERTS);

export const EmergencyService = {
  async getAlerts(): Promise<Alert[]> {
    return withMockLatency(() => cloneMock(alerts.filter((alert) => alert.priority !== "low")));
  },
};
