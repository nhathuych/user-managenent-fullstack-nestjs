import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType(): Biến tất cả các field thành optional.
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const) // OmitType(): Bỏ qua field email, không cho update.
) {}
