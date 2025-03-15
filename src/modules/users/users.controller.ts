import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateObjectIdPipe } from '@/common/pipes/validate-object-id.pipe';

// Định nghĩa route gốc là /users
// Route con có thể là / hoặc /:id tùy method
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Không cần async với await ở controller vì NestJS tự hiểu
    return this.usersService.create(createUserDto);
  }

  @Get() // /users?page=1&limit=10&sortBy=email&sortOrder=asc
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    // Không cần async với await ở controller vì NestJS tự hiểu
    return this.usersService.findAll(+page, +limit, sortBy, sortOrder);
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ValidateObjectIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
