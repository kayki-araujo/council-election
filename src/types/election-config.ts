import { Participant } from "./participant";
import { Role } from "./role";

export type ElectionConfig = {
  participants: Participant[];
  roles: Role[];
};
