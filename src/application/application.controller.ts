import { Controller, Get, Post, Body, Query, ParseIntPipe,Param, HttpCode } from '@nestjs/common';
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
  @HttpCode(200)
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }

  @Post('list')
  @HttpCode(200)
  getPage(@Body() queryAppDto: QueryApplicationDto) {
    return this.applicationService.getPage(queryAppDto);
  }

  @Get('all')
  getAll(@Query('name') name?: string) {
    return this.applicationService.getAll(name);
  }

  @Get('detail/:appId')
  getDetail(@Param('appId', ParseIntPipe) appId: number) {
    return this.applicationService.findOne(appId);
  }


  @Get('menus/:appId')
  getMenusTree(@Param('appId', ParseIntPipe) appId: number) {
    return this.applicationService.getMenusTree(appId);
  }

  @Post('update')
  @HttpCode(200)
  update(@Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationService.update(updateApplicationDto);
  }

  @Get('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.applicationService.remove(id);
  }
}
