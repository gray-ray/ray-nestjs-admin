import { Controller, Get, Post, Body, Patch, Query, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto, QueryMenuDto } from './dto/menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}


  @Post('create')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Post('trees')
  getTrees() {
    return this.menuService.getTrees();
  }

  @Get('detail')
  detail(@Query('id') id: number) {
    return this.menuService.findOne(id);
  }

  @Post('update')
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto);
  }

  @Get('delete')
  delete(@Query('id') id: number) {
    return this.menuService.remove(id);
  }
}
