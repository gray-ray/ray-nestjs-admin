import { Controller, Get, Post, Body, Patch, Param, Query ,ParseIntPipe, HttpCode} from '@nestjs/common';
import { RoleService } from './role.service';

import { CreateRoleDto, UpdateRoleDto, QueryRoleDto } from './dto/role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @HttpCode(200)
  create(@Body() createUserDto: CreateRoleDto) {
    return this.roleService.create(createUserDto);
  }

  @Post('list')
  @HttpCode(200)
  getPage(@Body() queryUserDto: QueryRoleDto) {
    return this.roleService.getPage(queryUserDto);
  }

  @Post('all')
  @HttpCode(200)
  getAll() {
    return this.roleService.getAll();
  }


  @Get('detail/:id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Post('update')
  @HttpCode(200)
  update(@Body() updateUserDto: UpdateRoleDto) {
    return this.roleService.update(updateUserDto);
  }

  @Get('delete/:id')
  delete(@Query('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
