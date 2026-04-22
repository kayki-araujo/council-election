const TAG = Symbol();

type None = {
  [TAG]: false;
};

const NONE: None = {
  [TAG]: false,
};

type Some<T> = {
  [TAG]: true;
  value: T;
};

export type Option<T> = None | Some<T>;

export const none = (): None => NONE;
export const some = <T>(value: T): Some<T> => ({ [TAG]: true, value });

export const isNone = <T>(option: Option<T>): option is None =>
  option[TAG] === false;
export const isSome = <T>(option: Option<T>): option is Some<T> =>
  option[TAG] === true;
