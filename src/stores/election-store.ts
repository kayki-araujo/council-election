import { ElectionConfig } from "@/types";
import { create } from "zustand";

interface ElectionStore {
  config: ElectionConfig | null;
  setConfig: (config: ElectionConfig) => void;
}

export const useElectionStore = create<ElectionStore>()((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
}));
