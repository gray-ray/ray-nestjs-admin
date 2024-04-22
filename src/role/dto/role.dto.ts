// 函数用处 类比 ts 中的partial  和 pick
import { PartialType, PickType, OmitType } from '@nestjs/mapped-types';

import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  roleName: string;

  @IsNotEmpty()
  code: string;

  status: boolean;

  remark: string;

  createTime: string;

  updateTime: string;
}

export class QueryRoleDto extends PartialType(CreateRoleDto) {
  id?: number;
  pageSize: number;
  pageNum: number;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class RoleDto {}
