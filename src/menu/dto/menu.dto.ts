import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMenuDto {

  menuName: string;

  type: string;

  sortNum: number;

  component: string;

  route: string;


  status: boolean;

  show: boolean;

  appId: number;

  parentId: number;

  parent?: CreateMenuDto;

  children?: CreateMenuDto[];
}

export class MenuDto extends PartialType(CreateMenuDto) {
  id: number;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  id: number;
  parentId?: number;
}

export class QueryMenuDto extends PartialType(CreateMenuDto) {
  pageSize: number;
  pageNum: number;
}
