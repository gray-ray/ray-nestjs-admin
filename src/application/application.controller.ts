import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import {
  CreateApplicationDto,
  QueryApplicationDto,
  UpdateApplicationDto,
} from './dto/application';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('create')
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }

  @Post('list')
  getPage(@Body() queryAppDto: QueryApplicationDto) {
    return this.applicationService.getPage(queryAppDto);
  }

  @Get('all')
  getAll(@Param('name') name: string) {
    return this.applicationService.getAll(name);
  }

  @Post('update')
  update(@Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationService.update(updateApplicationDto);
  }

  @Get('remove')
  remove(@Param('id') id: number) {
    return this.applicationService.remove(id);
  }
}
