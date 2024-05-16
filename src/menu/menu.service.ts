import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { MyLogger } from 'core/middlewares/my-logger.service';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  columnNames: string[];

  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Menu)
    private readonly treeRepository: TreeRepository<Menu>,
    private readonly myLogger: MyLogger,
  ) {
    // NOTE: 设置日志标识
    // Nest] 73420  - 2024/04/18 15:19:15     LOG [userService] 自定义日志信息...
    this.myLogger.setContext('menuService');

    // NOTE: 获取表结构字段
    const metadata = this.menuRepository.metadata;
    this.columnNames = metadata.columns.map((column) => column.propertyName);
  }

  async create(createMenu: CreateMenuDto) {
    const {
      menuName,
      parentId,
      component,
      type,
      sortNum,
      route,
      status,
      show,
      appId,
    } = createMenu;

    const menu = new Menu();

    let has = null;
    if (parentId) {
      has = await this.menuRepository.findOne({
        where: { id: parentId },
      });
    }

    const newObj = Object.assign(menu, {
      menuName,
      component,
      type,
      show,
      sortNum,
      status,
      route,
      appId,
      parentId,
    });

    if (has) {
      newObj.parent = has;
    }

    const res = await this.menuRepository.save(newObj);

    return res;
  }

  async getTrees() {
    const qb = await this.treeRepository.findTrees();
    return qb;
  }

  async findOne(id: number) {
    const menu = new Menu();
    menu.id = id;

    // TODO: 2次查询组装，性能不是很好 暂时没有其他方法
    const current = await this.menuRepository.findOne({ where: { id } });

    if (!current) {
      return null;
    }

    const children = await this.treeRepository.findDescendantsTree(menu);

    return { ...current, ...children };
  }

  // NOTE: 修改菜单，只能修改当前id 的菜单
  async update(updateMenu: UpdateMenuDto) {
    const { id, parentId, ...reset } = updateMenu;

    let has = null;
    if (parentId) {
      has = await this.menuRepository.findOne({
        where: { id: parentId },
      });
    }

    if (has) {
      updateMenu.parent = has;
    }

    const exitsMenu = await this.menuRepository.findOne({
      where: { id },
    });

    if (!exitsMenu) {
      throw new HttpException('菜单不存在', HttpStatus.OK);
    }

    for (const key in reset) {
      if (this.columnNames.includes(key)) {
        exitsMenu[key] = reset[key];
      }
    }

    const res = await this.menuRepository.save(exitsMenu);

    if (res) {
      this.myLogger.warn('菜单信息修改');
    }

    return res;
  }

  async remove(id: number) {
    const exitsMenu = await this.menuRepository.findOne({
      where: { id },
    });

    if (!exitsMenu) {
      throw new HttpException('菜单不存在', HttpStatus.OK);
    }
    const res = await this.menuRepository.remove(exitsMenu);
    if (res) {
      this.myLogger.warn('菜单删除');
    }
    return res;
  }
}
