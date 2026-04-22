declare const __brand: unique symbol;

export type Brand<T> = T & { [__brand]: never };
