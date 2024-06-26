import { Controller, Get, Post, Body, Patch, Query, Delete, ParseIntPipe,Param, HttpCode } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto, QueryMenuDto } from './dto/menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}


  @Post('create')
  @HttpCode(200)
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Post('trees')
  @HttpCode(200)
  getTrees() {
    return this.menuService.getTrees();
  }

  @Get('detail/:id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Post('update')
  @HttpCode(200)
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto);
  }

  @Get('delete/:id')
  delete(@Param('id') id: number) {
    return this.menuService.remove(id);
  }
}
