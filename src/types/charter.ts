import { Nominee } from "./nominee";
import { Seat } from "./seat";

export type Charter = {
  nominees: Nominee[];
  seats: Seat[];
};
