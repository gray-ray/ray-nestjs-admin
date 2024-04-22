import { PartialType, PickType } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  appName: string;
}

export class QueryApplicationDto extends PartialType(CreateApplicationDto) {
  pageSize: number;
  pageNum: number;
}

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  id: number;
}
