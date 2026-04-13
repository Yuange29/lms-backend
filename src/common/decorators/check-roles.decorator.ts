import { SetMetadata } from '@nestjs/common';

export enum Role {
  admin = 'ADMIN',
  instructor = 'INSTRUCTOR',
  student = 'STUDENT',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
