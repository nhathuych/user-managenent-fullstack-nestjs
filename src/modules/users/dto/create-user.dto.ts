// DTO:Data Transfer Object
// Là một class dùng để định nghĩa cấu trúc dữ liệu mà client gởi lên server.

import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

// Ko gởi thừa/thiếu vì 1 số trường mặt định tự tạo như isActive(default: false), createdAt, updatedAt,...
export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

  @IsOptional()
  image: string;
}
