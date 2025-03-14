import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// User là 1 class thuần của TypeScript để định nghĩa name, email,...
@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  email: number;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  image: string;

  @Prop({ default: "USERS" })
  role: string;

  @Prop({ default: "LOCAL" })
  accountType: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  codeId: string;

  @Prop()
  codeExpired: Date;
}

// UserSchema: Schema thực sự của MongoDB
// Cho phép gọi các hàm find(), update(), delete()
export const UserSchema = SchemaFactory.createForClass(User);
