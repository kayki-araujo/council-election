export function* generateCartesianProduct<T>(width: number, pool: T[]) {
  if (pool.length === 0 || width <= 0) return;

  const indices: number[] = new Array(width).fill(0);

  while (true) {
    yield indices.map((index) => pool[index]);

    let pointer = width - 1;
    while (pointer >= 0 && indices[pointer] === pool.length - 1) {
      indices[pointer] = 0;
      pointer--;
    }

    if (pointer < 0) break;

    indices[pointer]++;
  }
}
