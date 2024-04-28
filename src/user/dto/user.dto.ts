// 函数用处 类比 ts 中的partial  和 pick
import { PartialType, PickType, OmitType } from '@nestjs/mapped-types';

import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: '邮件格式不正确' })
  email: string;

  @IsNotEmpty({ message: 'username 字段不能为空' })
  username: string;

  @IsNotEmpty({ message: 'password 字段不能为空' })
  password: string;

  nickname: string;

  status: boolean;

  phone: string;

  remark: string;

  roleIds: number[];
}

export class QueryUserDto extends PartialType(CreateUserDto) {
  id?: number;
  pageSize: number;
  pageNum: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: 'id 字段不能为空' })
  @IsNumber()
  id: number;
}

export class UserDto {}
