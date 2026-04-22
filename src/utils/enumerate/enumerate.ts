export const enumerate = <T>(list: T[]): [index: number, item: T][] =>
  list.map((item, index) => [index, item]);
