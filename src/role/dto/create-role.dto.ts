import { IsString } from 'class-validator';

import { ROLE } from '../entity/role.entity';

export class CreateRoleDto {
  @IsString()
  role!: ROLE;
}
