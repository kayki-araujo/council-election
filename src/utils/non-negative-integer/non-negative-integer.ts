import { Brand } from "../brand";

export type NonNegativeInteger = Brand<number>;

export const isNumberNonNegativeInteger = (
  n: number,
): n is NonNegativeInteger => n >= 0 && Number.isInteger(n);
