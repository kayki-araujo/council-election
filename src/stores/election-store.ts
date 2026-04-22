import { Ballot, Charter } from "@/types";
import { create } from "zustand";

interface ElectionStore {
  charter: Charter | null;
  ballots: Ballot[] | null;
  setCharter: (charter: Charter) => void;
  setBallots: (ballots: Ballot[] | null) => void;
}

export const useElectionStore = create<ElectionStore>()((set) => ({
  charter: null,
  ballots: null,
  setCharter: (charter) => set({ charter }),
  setBallots: (ballots) => set({ ballots }),
}));
