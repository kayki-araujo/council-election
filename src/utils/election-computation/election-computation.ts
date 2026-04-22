import { Ballot, Charter, Seat } from "@/types";
import { enumerate } from "../enumerate";
import { generateCartesianProduct } from "../generate-cartesian-product";
import { getHarmonicNumber } from "../get-harmonic-number";
import { isNumberNonNegativeInteger } from "../non-negative-integer";

const groupSeatsByTier = (seats: Seat[]): string[][] => {
  const tierMap = new Map<number, string[]>();
  for (const seat of seats) {
    if (!tierMap.has(seat.priority)) tierMap.set(seat.priority, []);
    tierMap.get(seat.priority)!.push(seat.name);
  }
  return [...tierMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, names]) => names);
};

function isInvalidSlate(branch: string[][], eligibles: string[]): boolean {
  if (branch.length === 0) return false;

  const previousTiers = branch.slice(0, -1);
  const slate = branch[branch.length - 1];

  const histories = new Map<string, number[]>();
  for (const p of eligibles) {
    const tierCounts = previousTiers.map(
      (tier) => tier.filter((name) => name === p).length,
    );
    const total = tierCounts.reduce((a, b) => a + b, 0);
    histories.set(p, [total, ...tierCounts]);
  }

  const compareTax = (a: string, b: string, h: Map<string, number[]>) => {
    const hA = h.get(a)!;
    const hB = h.get(b)!;
    for (let i = 0; i < hA.length; i++) {
      if (hA[i] !== hB[i]) return hA[i] - hB[i];
    }
    return 0;
  };

  const pool = [...eligibles];
  for (const appointed of slate) {
    const idx = pool.indexOf(appointed);
    if (idx > -1) pool.splice(idx, 1);
  }

  for (const appointed of slate) {
    for (const leftOut of pool) {
      if (compareTax(leftOut, appointed, histories) < 0) return true;
    }
  }

  return false;
}

export const convene = (
  charter: Charter,
  ballots: Ballot[],
): Record<string, string>[] => {
  const eligibles = charter.nominees
    .filter((n) => n.isEligible)
    .map((n) => n.name);

  const tiers = groupSeatsByTier(charter.seats);
  let branches: string[][][] = [[]];

  for (const tier of tiers) {
    let bestScoreThisRound = -Infinity;
    let nextBranches: string[][][] = [];

    for (const branch of branches) {
      let bestSlates: string[][] = [];
      let bestSlateScore = -Infinity;

      for (const slate of generateCartesianProduct(tier.length, eligibles)) {
        if (isInvalidSlate([...branch, slate], eligibles)) continue;

        let slateScore = 0;
        for (const ballot of ballots) {
          let matches = 0;
          for (const [seatIndex, nominee] of enumerate(slate)) {
            if (ballot[tier[seatIndex]][nominee]) matches++;
          }
          if (!isNumberNonNegativeInteger(matches))
            throw new Error("match count is not a non-negative integer");
          slateScore += getHarmonicNumber(matches);
        }

        if (slateScore > bestSlateScore) {
          bestSlateScore = slateScore;
          bestSlates = [slate];
        } else if (slateScore === bestSlateScore) {
          bestSlates.push(slate);
        }
      }

      if (bestSlateScore > bestScoreThisRound) {
        bestScoreThisRound = bestSlateScore;
        nextBranches = bestSlates.map((slate) => [...branch, slate]);
      } else if (bestSlateScore === bestScoreThisRound) {
        for (const slate of bestSlates) {
          nextBranches.push([...branch, slate]);
        }
      }
    }

    branches = nextBranches;
  }

  return branches.map((branch) => {
    const appointments: Record<string, string> = {};
    for (const [tierIndex, slate] of enumerate(branch)) {
      for (const [seatIndex, nominee] of enumerate(slate)) {
        appointments[tiers[tierIndex][seatIndex]] = nominee;
      }
    }
    return appointments;
  });
};
