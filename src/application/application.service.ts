import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  CreateApplicationDto,
  QueryApplicationDto,
  UpdateApplicationDto,
} from './dto/application';

import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { MyLogger } from 'core/middlewares/my-logger.service';
import { Menu } from 'src/menu/entities/menu.entity';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class ApplicationService {
  columnNames: string[];
  constructor(
    @InjectRepository(Application)
    private readonly appRepository: Repository<Application>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly myLogger: MyLogger,
  ) {
    this.myLogger.setContext('appService');

    // NOTE: 获取表结构字段
    const metadata = this.appRepository.metadata;
    this.columnNames = metadata.columns.map((column) => column.propertyName);
  }

  async create(createApplicationDto: CreateApplicationDto) {
    const { appName, roleIds = [] } = createApplicationDto;
    const exitsApp = await this.appRepository.findOne({
      where: { appName },
    });
    if (exitsApp) {
      throw new HttpException('应用名称已存在', HttpStatus.OK);
    }

    let roles: Role[] = [];
    if (roleIds?.length > 0) {
      roles = await this.roleRepository.findBy({ id: In(roleIds) });
    }

    const params = {
      roles,
      appName,
    };

    const res = await this.appRepository.manager.transaction(
      async (manager) => {
        const newApp = manager.create(Application, params);
        return await manager.save(Application, newApp);
      },
    );

    if (res) {
      this.myLogger.log('应用创建');
    }

    return res;
  }

  async getPage(query: QueryApplicationDto) {
    const { pageNum = 1, pageSize = 10, appName } = query;
    const qb = await this.appRepository.createQueryBuilder('application');

    if (appName) {
      qb.andWhere(`application.appName LIKE :appName`, {
        appName: `%${appName}%`,
      });
    }

    const [list, total] = await qb
      .take(pageSize)
      .skip(pageSize * (pageNum - 1))
      .getManyAndCount();

    return { list, total };
  }

  async getAll(appName?: string) {
    const res = await this.appRepository.find({ where: { appName } });
    return res;
  }

  async getMenusTree(id: number) {
    const exitsApp = await this.appRepository.findOne({ where: { id } });

    if (!exitsApp) {
      throw new HttpException('应用名称不存在', HttpStatus.OK);
    }

    const queryBuilder = this.menuRepository.createQueryBuilder('menus');
    const res = await queryBuilder
      .where('menus.appId = :appId', { appId: id })
      .getMany();

    return this.flat2Tree(res);
  }

  treeAdd(list: Menu[], item: Menu) {
    for (let i = 0, len = list?.length; i < len; i++) {
      if (list[i]?.id === item.parentId) {
        list[i].children?.push(item);
        return;
      }
      if (list[i].children?.length > 0) {
        this.treeAdd(list[i].children, item);
      }
    }
  }

  flat2Tree(list: Menu[]) {
    const final = [];
    list?.concat()?.forEach((o) => {
      o.children = [];
      if (final?.length === 0 || o?.parentId === 0) {
        final.push(o);
        return;
      }
      this.treeAdd(final, o);
    });
    return final;
  }

  async update(updateApp: UpdateApplicationDto) {
    const { appName, roleIds = [], ...reset } = updateApp;

    const exitsApp = await this.appRepository.findOne({
      where: { appName },
    });

    if (!exitsApp) {
      throw new HttpException('应用不存在', HttpStatus.OK);
    }

    exitsApp.appName = appName;

    for (const key in reset) {
      if (this.columnNames.includes(key)) {
        exitsApp[key] = reset[key];
      }
    }

    if (roleIds?.length > 0) {
      const roles: Role[] = await this.roleRepository.findBy({
        id: In(roleIds),
      });
      exitsApp.roles = roles;
    }

    const res = await this.appRepository.manager.transaction(
      async (manager) => {
        return await manager.save(Application, exitsApp);
      },
    );


    if (res) {
      this.myLogger.warn('应用信息修改');
    }

    return res;
  }

  async remove(id: number) {
    const exitsApp = await this.appRepository.findOne({
      where: { id },
    });

    if (!exitsApp) {
      throw new HttpException('应用不存在', HttpStatus.OK);
    }

    const res = await this.appRepository.manager.transaction(
      async (manager) => {
        return await manager.remove(Application, exitsApp);
      },
    );

    if (res) {
      this.myLogger.warn('应用删除');
    }
    return res;
  }
}
