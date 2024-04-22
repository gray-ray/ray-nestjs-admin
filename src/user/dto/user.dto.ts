// 函数用处 类比 ts 中的partial  和 pick
import { PartialType, PickType, OmitType } from '@nestjs/mapped-types';

import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  nickname: string;

  status: boolean;

  phone: string;

  roleIds: number[];
}

export class QueryUserDto extends PartialType(CreateUserDto) {
  id?: number;
  pageSize: number;
  pageNum: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class UserDto {}
