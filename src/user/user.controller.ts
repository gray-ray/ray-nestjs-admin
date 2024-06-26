import {
  Controller,
  Post,
  Body,
  Get,
  ParseIntPipe,
  Param,
  HttpCode
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto/user.dto';
import { Public } from 'core/decorators/public.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @ApiExcludeEndpoint() // 接口在文档中隐藏
  @Post('noAuthCreate')
  @HttpCode(200)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('create')
  @HttpCode(200)
  createWithAuth(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('list')
  @HttpCode(200)
  getPage(@Body() queryUserDto: QueryUserDto) {
    return this.userService.getPage(queryUserDto);
  }

  @Get('detail/:id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post('update')
  @HttpCode(200)
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Get('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
