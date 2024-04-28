// 函数用处 类比 ts 中的partial  和 pick
import { PartialType, PickType, OmitType } from '@nestjs/mapped-types';

import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty({ message: 'username 字段不能为空' })
  username: string;

  @IsNotEmpty({ message: 'password 字段不能为空' })
  password: string;

  id: number;
}
