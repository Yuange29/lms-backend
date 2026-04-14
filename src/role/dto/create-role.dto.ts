import { IsString } from 'class-validator';

import { ROLE } from '../../users/entity/role.entity';

export class CreateRoleDto {
  @IsString()
  role!: ROLE;
}
