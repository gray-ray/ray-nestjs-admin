import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DictService } from './dict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';

@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post()
  create(@Body() createDictDto: CreateDictDto) {
    return this.dictService.create(createDictDto);
  }

  @Get()
  findAll() {
    return this.dictService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dictService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDictDto: UpdateDictDto) {
    return this.dictService.update(+id, updateDictDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictService.remove(+id);
  }
}
