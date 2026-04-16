import { Ballot, ElectionConfig } from "@/types";
import { create } from "zustand";

interface ElectionStore {
  config: ElectionConfig | null;
  ballots: Ballot[] | null;
  setConfig: (config: ElectionConfig) => void;
  setBallots: (ballots: Ballot[] | null) => void;
}

export const useElectionStore = create<ElectionStore>()((set) => ({
  config: null,
  ballots: null,
  setConfig: (config) => set({ config }),
  setBallots: (ballots) => set({ ballots }),
}));
