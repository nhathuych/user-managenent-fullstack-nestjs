// DTO:Data Transfer Object
// Là một class dùng để định nghĩa cấu trúc dữ liệu mà client gởi lên server.

import { IsNotEmpty } from "class-validator";

// Ko gởi thừa/thiếu vì 1 số trường mặt định tự tạo như isActive(default: false), createdAt, updatedAt,...
export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  // email: string;
  // password: string;
  // phone: string;
  // address: string;
  // image: string;
}
