import { create } from "zustand";
import { Fan } from "@/types";
import { FANS } from "@/mock";

interface NearbyFansStore {
  nearbyUsers: Fan[];
  connectedPeers: Fan[];
  discoveryEnabled: boolean;

  addNearbyUser: (user: Fan) => void;
  removeNearbyUser: (userId: string) => void;
  updateSignal: (userId: string, signal: number) => void;
  setDiscovery: (enabled: boolean) => void;
  updateNearbyUsers: (users: Fan[]) => void;
  connectPeer: (user: Fan) => void;
  disconnectPeer: (userId: string) => void;
}

export const useNearbyFansStore = create<NearbyFansStore>((set) => ({
  nearbyUsers: FANS.slice(0, 24),
  connectedPeers: FANS.slice(0, 5),
  discoveryEnabled: true,

  addNearbyUser: (user) =>
    set((state) => {
      if (state.nearbyUsers.find((u) => u.id === user.id)) {
        return state;
      }
      return { nearbyUsers: [...state.nearbyUsers, user] };
    }),

  removeNearbyUser: (userId) =>
    set((state) => ({
      nearbyUsers: state.nearbyUsers.filter((u) => u.id !== userId),
    })),

  updateSignal: (userId, signal) =>
    set((state) => ({
      nearbyUsers: state.nearbyUsers.map((u) =>
        u.id === userId ? { ...u, signal: Math.min(100, Math.max(0, signal)) } : u
      ),
      connectedPeers: state.connectedPeers.map((u) =>
        u.id === userId ? { ...u, signal: Math.min(100, Math.max(0, signal)) } : u
      ),
    })),

  setDiscovery: (enabled) => set({ discoveryEnabled: enabled }),

  updateNearbyUsers: (users) => set({ nearbyUsers: users }),

  connectPeer: (user) =>
    set((state) => {
      if (state.connectedPeers.find((p) => p.id === user.id)) {
        return state;
      }
      return { connectedPeers: [...state.connectedPeers, user] };
    }),

  disconnectPeer: (userId) =>
    set((state) => ({
      connectedPeers: state.connectedPeers.filter((p) => p.id !== userId),
    })),
}));

// Selectors
export const selectNearbyUsers = (state: NearbyFansStore) => state.nearbyUsers;
export const selectConnectedPeers = (state: NearbyFansStore) =>
  state.connectedPeers;
export const selectDiscoveryEnabled = (state: NearbyFansStore) =>
  state.discoveryEnabled;
export const selectNearbyUserById = (userId: string) => (state: NearbyFansStore) =>
  state.nearbyUsers.find((u) => u.id === userId);
