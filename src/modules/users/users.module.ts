import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

// @Module() = "Cầu nối" để kết nối giữa Controller, Service và Database trong NestJS.
// Nếu không có @Module() thì:
// 1. Không inject được Service vào Controller vì Mất Dependency Injection
// 2. Không kết nối được MongoDB               vì Mongoose không nhận schema
// 3. Không dùng được @Injectable()            vì Service không hoạt động
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])], // User: class, UserSchema: schema của mongo(dùng để gọi hàm find(), update(), delete(), ...)
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Cần export UsersService để có thể inject vô Controller khác, còn với users.controller thì không cần
})

export class UsersModule {}
