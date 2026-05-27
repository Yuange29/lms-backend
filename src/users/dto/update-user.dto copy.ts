import { IsOptional, IsString, Min } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Min(6, { message: 'password must be at least 6 chrs' })
  password?: string;

  @IsString()
  @Min(2, { message: 'full name must be at least 2 chrs' })
  full_name?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;
}
