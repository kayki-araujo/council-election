import { isSome, Option } from "@/utils";
import { ReactNode } from "react";

type GuardProps<T, E> = {
  value: T;
  clause: (value: T) => Option<E>;
  then: (value: E) => ReactNode;
  otherwise: () => ReactNode;
};

export const Guard = <T, E>({
  value,
  clause,
  then,
  otherwise,
}: GuardProps<T, E>) => {
  const result = clause(value);
  if (isSome(result)) return then(result.value);
  return otherwise();
};
