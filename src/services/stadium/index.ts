import type { MatchInfo, StadiumInfo, StadiumSection, Summary } from "@/types";
import { CURRENT_STADIUM, SUMMARIES, TODAY_MATCH, STADIUM_SECTIONS } from "@/mock";
import { cloneMock, withMockLatency } from "../mockLatency";

export const StadiumService = {
  async getCurrentStadium(): Promise<StadiumInfo> {
    return withMockLatency(() => cloneMock(CURRENT_STADIUM));
  },

  async getTodayMatch(): Promise<MatchInfo> {
    return withMockLatency(() => cloneMock(TODAY_MATCH));
  },

  async getSections(): Promise<StadiumSection[]> {
    return withMockLatency(() => cloneMock(STADIUM_SECTIONS));
  },

  async getCrowdSummaries(): Promise<Summary[]> {
    return withMockLatency(() => cloneMock(SUMMARIES));
  },
};
