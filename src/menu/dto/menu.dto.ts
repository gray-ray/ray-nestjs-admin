import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty({ message: 'menuName 字段不能为空' })
  menuName: string;

  type: string;

  sortNum: number;

  component: string;

  route: string;

  status: boolean;

  show: boolean;

  @IsNotEmpty({ message: 'appId 字段不能为空' })
  @IsNumber()
  appId: number;

  parentId: number;

  parent?: CreateMenuDto;

  children?: CreateMenuDto[];
}

export class MenuDto extends PartialType(CreateMenuDto) {
  id: number;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @IsNotEmpty({ message: 'id 字段不能为空' })
  id: number;
  parentId?: number;
}

export class QueryMenuDto extends PartialType(CreateMenuDto) {
  pageSize: number;
  pageNum: number;
}
