// 函数用处 类比 ts 中的partial  和 pick
import { PartialType, PickType, OmitType } from '@nestjs/mapped-types';

import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'roleName 字段不能为空' })
  roleName: string;

  @IsNotEmpty({ message: 'code 字段不能为空' })
  code: string;

  status: boolean;

  remark: string;

  createTime: string;

  updateTime: string;

  appIds: number[];
}

export class QueryRoleDto extends PartialType(CreateRoleDto) {
  id?: number;
  pageSize: number;
  pageNum: number;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNotEmpty({ message: 'id 字段不能为空' })
  @IsNumber()
  id: number;
}

export class RoleDto {}
