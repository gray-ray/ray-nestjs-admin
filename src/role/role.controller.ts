import { Controller, Get, Post, Body, Patch, Param, Query ,ParseIntPipe} from '@nestjs/common';
import { RoleService } from './role.service';

import { CreateRoleDto, UpdateRoleDto, QueryRoleDto } from './dto/role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  create(@Body() createUserDto: CreateRoleDto) {
    return this.roleService.create(createUserDto);
  }

  @Post('list')
  getPage(@Body() queryUserDto: QueryRoleDto) {
    return this.roleService.getPage(queryUserDto);
  }

  @Get('detail/:id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Post('update')
  update(@Body() updateUserDto: UpdateRoleDto) {
    return this.roleService.update(updateUserDto);
  }

  @Get('delete/:id')
  delete(@Query('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
