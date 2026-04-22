import { Ballot, ElectionConfig, Role } from "@/types";
import { enumerate } from "../enumerate";
import { generateCartesianProduct } from "../generate-cartesian-product";
import { getHarmonicNumber } from "../get-harmonic-number";
import { isNumberNonNegativeInteger } from "../non-negative-integer";

export type ComputationSignal =
  | { tag: "working"; currentCombination: number; totalCombinations: number }
  | { tag: "done"; results: Record<string, string>[] };

const orderRolesByPriority = (roles: Role[]): string[][] => {
  const priorityToRoles = new Map<number, string[]>();
  for (const role of roles) {
    if (!priorityToRoles.has(role.priority))
      priorityToRoles.set(role.priority, []);
    priorityToRoles.get(role.priority)!.push(role.name);
  }
  return [...priorityToRoles.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, names]) => names);
};

function isRealityBroken(reality: string[][], eligibles: string[]): boolean {
  if (reality.length === 0) return false;

  const previousOutcomes = reality.slice(0, -1);
  const outcomeToValidate = reality[reality.length - 1];

  const roleCounts = new Map<string, number>(eligibles.map((e) => [e, 0]));
  for (const outcome of previousOutcomes) {
    for (const person of outcome) {
      roleCounts.set(person, (roleCounts.get(person) ?? 0) + 1);
    }
  }

  const lastRoundAssigned = new Set<string>(
    previousOutcomes.length > 0
      ? previousOutcomes[previousOutcomes.length - 1]
      : [],
  );

  const priorityScoreOf = (person: string, counts: Map<string, number>) =>
    (counts.get(person) ?? 0) * 2 + (lastRoundAssigned.has(person) ? 1 : 0);

  const remaining = new Map<string, number>();
  for (const person of outcomeToValidate) {
    remaining.set(person, (remaining.get(person) ?? 0) + 1);
  }

  const tempCounts = new Map(roleCounts);
  for (let slot = 0; slot < outcomeToValidate.length; slot++) {
    const minScore = Math.min(
      ...eligibles.map((p) => priorityScoreOf(p, tempCounts)),
    );

    const picked = eligibles.find(
      (p) =>
        (remaining.get(p) ?? 0) > 0 &&
        priorityScoreOf(p, tempCounts) === minScore,
    );

    if (picked === undefined) return true;

    remaining.set(picked, remaining.get(picked)! - 1);
    tempCounts.set(picked, (tempCounts.get(picked) ?? 0) + 1);
  }

  return false;
}

export const computeElection = (
  config: ElectionConfig,
  ballots: Ballot[],
): Record<string, string>[] => {
  const eligibles = config.participants
    .filter((p) => p.eligible)
    .map((p) => p.name);

  const orderedRoleGroups = orderRolesByPriority(config.roles);

  let parallelRealities: string[][][] = [[]];

  for (const currentRoles of orderedRoleGroups) {
    let bestScoreThisRound = -Infinity;
    let nextParallelRealities: string[][][] = [];

    for (const reality of parallelRealities) {
      let bestOutcomesForThisReality: string[][] = [];
      let bestOutcomeScore = -Infinity;

      for (const possibleOutcome of generateCartesianProduct(
        currentRoles.length,
        eligibles,
      )) {
        if (isRealityBroken([...reality, possibleOutcome], eligibles)) continue;

        let possibleOutcomeTotalHarmonicApproval = 0;
        for (const ballot of ballots) {
          let numberOfBallotMatches = 0;
          for (const [roleIndex, candidate] of enumerate(possibleOutcome)) {
            const role = currentRoles[roleIndex];
            if (ballot[role][candidate]) numberOfBallotMatches++;
          }
          if (!isNumberNonNegativeInteger(numberOfBallotMatches))
            throw new Error(
              "number of ballot matches is not a non-negative integer",
            );
          possibleOutcomeTotalHarmonicApproval += getHarmonicNumber(
            numberOfBallotMatches,
          );
        }

        if (possibleOutcomeTotalHarmonicApproval > bestOutcomeScore) {
          bestOutcomeScore = possibleOutcomeTotalHarmonicApproval;
          bestOutcomesForThisReality = [possibleOutcome];
        } else if (possibleOutcomeTotalHarmonicApproval === bestOutcomeScore) {
          bestOutcomesForThisReality.push(possibleOutcome);
        }
      }

      if (bestOutcomeScore > bestScoreThisRound) {
        bestScoreThisRound = bestOutcomeScore;
        nextParallelRealities = bestOutcomesForThisReality.map((outcome) => [
          ...reality,
          outcome,
        ]);
      } else if (bestOutcomeScore === bestScoreThisRound) {
        for (const outcome of bestOutcomesForThisReality) {
          nextParallelRealities.push([...reality, outcome]);
        }
      }
    }

    parallelRealities = nextParallelRealities;
  }

  return parallelRealities.map((reality) => {
    const assignments: Record<string, string> = {};
    for (const [tierIndex, outcome] of enumerate(reality)) {
      const roles = orderedRoleGroups[tierIndex];
      for (const [roleIndex, candidate] of enumerate(outcome)) {
        assignments[roles[roleIndex]] = candidate;
      }
    }
    return assignments;
  });
};
