import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from '@/helpers/password.helper';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { MailService } from '@/mail/mail.service';
import { VerifyAccountAuthDto } from '@/auth/dto/verify-account-auth.dto';
import { UpdatePasswordDto } from '@/auth/dto/update-password.dto';

// @Injectable() giúp tạo 1 singleton
// Tự nestjs sẽ tạo đối tượng, ta không cần phải làm như vầy: new UsersService()
// Chỉ cần làm như vầy: private userService: UserService
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService
  ) {
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

  findOne(_id: string) {
    return this.userModel.findOne({ _id }).select('-password');
  }

  findOneBy(value: string) {
    return this.userModel.findOne({ $or: [{ email: value }, { phone: value }] });
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.updateOne({ _id }, updateUserDto);
    if (user.matchedCount === 0) throw new BadRequestException(`User with _id ${_id} does not exist.`);

    return updateUserDto;
  }

  remove(_id: string) {
    return this.userModel.deleteOne({ _id });
  }

  doesEmailExist(email: string) {
    return this.userModel.exists({ email });
  }

  async handleRegister(createAuthDto: CreateAuthDto) {
    const { name, email, password } = createAuthDto;

    const user = await this.doesEmailExist(email);
    if (user) throw new BadRequestException('Email has already been taken.');

    const hashedPassword = await hashPassword(password);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      isActive: false,
      activationCode: uuidv4(),
      codeExpired: dayjs().add(1, 'day')
    });

    this.mailService.sendUserConfirmation(newUser)

    return { _id: newUser._id };
  }

  async handleVerifyAccount(verifyAccountAuthDto: VerifyAccountAuthDto) {
    const { _id, activationCode } = verifyAccountAuthDto;

    const user = await this.userModel.findOne({ _id });
    if (!user) throw new BadRequestException('User not found.');
    if (!dayjs().isBefore(user.codeExpired)) throw new BadRequestException('Verification code has expired.');

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id, activationCode },
      { isActive: true },
      { new: true }
    ).lean();

    if (!updatedUser) throw new BadRequestException('Invalid verification code.');

    return { isActive: updatedUser.isActive };
  }

  async resendVerifyEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found.');
    if (user.isActive) throw new BadRequestException('User has already been verified.');

    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      { activationCode: uuidv4(), codeExpired: dayjs().add(1, 'day') },
      { new: true }
    )
    if (!updatedUser) throw new BadRequestException('Failed to send email.');
    this.mailService.sendUserConfirmation(updatedUser);

    return { _id: updatedUser._id };
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found.');

    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      { activationCode: uuidv4(), codeExpired: dayjs().add(1, 'day') },
      { new: true }
    )
    if (!updatedUser) throw new BadRequestException('Failed to send email.');
    this.mailService.sendResetPasswordEmail(updatedUser);

    return { email };
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { email, password, activationCode } = updatePasswordDto;

    const user = await this.userModel.findOne({ email, activationCode });
    if (!user) throw new BadRequestException('No user found. Please verify your email and activation code.');
    if (!dayjs().isBefore(user.codeExpired)) throw new BadRequestException('Verification code has expired.');

    const hashedPassword = await hashPassword(password);
    const res = await user.updateOne({ password: hashedPassword });
    if (!res.acknowledged) throw new BadRequestException('Failed to update password.');

    return res;
  }
}
