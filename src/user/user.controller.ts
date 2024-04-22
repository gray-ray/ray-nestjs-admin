import { Controller, Post, Body, Get, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('list')
  getPage(@Body() queryUserDto: QueryUserDto) {
    return this.userService.getPage(queryUserDto);
  }

  @Get('detail')
  detail(@Query('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post('update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Get('delete')
  delete(@Query('id') id: number) {
    return this.userService.remove(id);
  }
}
