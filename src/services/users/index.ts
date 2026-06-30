import type { CurrentUser, Fan } from "@/types";
import { CURRENT_USER, FANS } from "@/mock";
import { cloneMock, withMockLatency } from "../mockLatency";

export const UserService = {
  async getCurrentUser(): Promise<CurrentUser> {
    return withMockLatency(() => cloneMock(CURRENT_USER));
  },

  async getNearbyFans(): Promise<Fan[]> {
    return withMockLatency(() => cloneMock(FANS.slice(0, 24)));
  },

  async getConnectedPeers(): Promise<Fan[]> {
    return withMockLatency(() => cloneMock(FANS.slice(0, 5)));
  },
};
