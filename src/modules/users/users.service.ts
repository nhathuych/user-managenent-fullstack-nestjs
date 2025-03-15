import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from '@/helpers/password.helper';

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
    const { name, email, password, phone, address, image } = createUserDto;

    const user = await this.doesEmailExist(email);
    if (user) throw new BadRequestException('Email has already been taken.'); // Tự động trả về status 400

    const hashedPassword = await hashPassword(password);
    const newUser = await this.userModel.create({ name, email, phone, address, image, password: hashedPassword });
    return { _id: newUser._id };
  }

  async findAll(page: number = 1, limit: number = 10, sortBy: string = 'name', sortOrder: 'asc' | 'desc' = 'asc') {
    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const users = await this.userModel.find().select('-password').skip(skip).limit(limit).sort({ [sortBy]: sortDirection }).exec();
    const total = await this.userModel.countDocuments();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      sortBy,
      sortOrder,
      data: users
    };
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

  async doesEmailExist(email: string) {
    return await this.userModel.exists({ email });
  }
}
