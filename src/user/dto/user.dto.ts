// 函数用处 类比 ts 中的partial  和 pick
import { PartialType, PickType, OmitType } from '@nestjs/mapped-types';

import {  IsNotEmpty, IsNumber ,IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  email: string;

  @IsNotEmpty({ message: 'username 字段不能为空' })
  username: string;

  @IsNotEmpty({ message: 'password 字段不能为空' })
  password: string;

  @IsOptional()
  nickname: string;

  @IsOptional()
  status: boolean;

  @IsOptional()
  phone: string;

  @IsOptional()
  remark: string;

  @IsOptional()
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
