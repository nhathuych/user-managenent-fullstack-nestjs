import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

// @Injectable() giúp tạo 1 singleton
// Tự nestjs sẽ tạo đối tượng, ta không cần phải làm như vầy: new UsersService()
// Chỉ cần làm như vầy: private userService: UserService
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    // @InjectModel(User.name): inject schema User vào trong Service để lấy schema User từ MongoDB

    // private userModel: chỉ dùng userModel trong class UsersService này
    // Tiết kiệm dòng code, không cần phải làm như vầy:
    // private userModel: Model<User>; // tương tự cho public và protected
    // constructor(@InjectModel(User.name) userModel: Model<User>) {
    //   this.userModel = userModel;
    // }

    // Model<User>
    // Định nghĩa kiểu dữ liệu là User cho Model của mongo
    // Không có <User> => await this.userModel.find(); // Kiểu trả về là any[]
    // Có <User>       => await this.userModel.find(); // Kiểu trả về là User[]
  }

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto)
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
