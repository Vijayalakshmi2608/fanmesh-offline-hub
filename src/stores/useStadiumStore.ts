import { create } from "zustand";
import { StadiumSection, StadiumInfo } from "@/types";
import { STADIUM_SECTIONS } from "@/mock";

interface StadiumStore {
  selectedStadium: StadiumInfo;
  stadiumSections: StadiumSection[];
  crowdDensity: Record<string, number>;

  selectStadium: (stadium: StadiumInfo) => void;
  updateCrowdDensity: (sectionId: string, density: number) => void;
  updateAllDensities: (densities: Record<string, number>) => void;
  getCrowdLevel: (sectionId: string) => "low" | "moderate" | "high" | "critical";
  getHighDensitySections: () => StadiumSection[];
}

export const useStadiumStore = create<StadiumStore>((set, get) => ({
  selectedStadium: {
    name: "Santiago Bernabéu",
    city: "Madrid",
    teams: ["Real Madrid"],
  },
  stadiumSections: STADIUM_SECTIONS,
  crowdDensity: Object.fromEntries(
    STADIUM_SECTIONS.map((s) => [s.id, s.density])
  ),

  selectStadium: (stadium) => set({ selectedStadium: stadium }),

  updateCrowdDensity: (sectionId, density) =>
    set((state) => ({
      stadiumSections: state.stadiumSections.map((s) =>
        s.id === sectionId ? { ...s, density } : s
      ),
      crowdDensity: {
        ...state.crowdDensity,
        [sectionId]: density,
      },
    })),

  updateAllDensities: (densities) =>
    set((state) => ({
      stadiumSections: state.stadiumSections.map((s) => ({
        ...s,
        density: densities[s.id] ?? s.density,
      })),
      crowdDensity: densities,
    })),

  getCrowdLevel: (sectionId) => {
    const density = get().crowdDensity[sectionId] ?? 0;
    if (density > 75) return "critical";
    if (density > 50) return "high";
    if (density > 25) return "moderate";
    return "low";
  },

  getHighDensitySections: () => {
    const state = get();
    return state.stadiumSections.filter((s) => s.density > 50);
  },
}));

// Selectors
export const selectSelectedStadium = (state: StadiumStore) =>
  state.selectedStadium;
export const selectStadiumSections = (state: StadiumStore) =>
  state.stadiumSections;
export const selectCrowdDensity = (state: StadiumStore) =>
  state.crowdDensity;
export const selectSectionDensity = (sectionId: string) => (state: StadiumStore) =>
  state.crowdDensity[sectionId] ?? 0;
export const selectHighDensitySections = (state: StadiumStore) =>
  state.stadiumSections.filter((s) => s.density > 50);
