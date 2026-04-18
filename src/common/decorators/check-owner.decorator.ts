import { SetMetadata } from '@nestjs/common';

export interface OwnershipOptions {
  entity: 'course' | 'section' | 'lesson' | 'quiz' | 'question' | 'answer';
  paramKey: string;
}

export const CHECK_OWNER_KEY = 'check_ownership';

export const CheckOwner = (options: OwnershipOptions) =>
  SetMetadata(CHECK_OWNER_KEY, options);
