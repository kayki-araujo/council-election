import { NonNegativeInteger } from "@/utils";

const MAX_CACHE_SIZE = 10_000;

const harmonicNumbersCache: number[] = [0];

export const getHarmonicNumber = (n: NonNegativeInteger): number => {
  if (n > MAX_CACHE_SIZE)
    throw new RangeError(`n must not exceed ${MAX_CACHE_SIZE}`);

  if (harmonicNumbersCache[n] !== undefined) return harmonicNumbersCache[n];

  for (let i = harmonicNumbersCache.length; i <= n; i++) {
    harmonicNumbersCache[i] = harmonicNumbersCache[i - 1] + 1 / i;
  }

  return harmonicNumbersCache[n];
};
