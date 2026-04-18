import { Role } from '../enums/roles.enum';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}
