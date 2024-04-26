import { Controller, Get, Post, Body, Query } from '@nestjs/common';
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
  getAll(@Query('name') name: string) {
    return this.applicationService.getAll(name);
  }

  @Get('menus')
  getMenusTree(@Query('appId') appId: number) {
    return this.applicationService.getMenusTree(appId);
  }

  @Post('update')
  update(@Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationService.update(updateApplicationDto);
  }

  @Get('remove')
  remove(@Query('id') id: number) {
    return this.applicationService.remove(id);
  }
}
