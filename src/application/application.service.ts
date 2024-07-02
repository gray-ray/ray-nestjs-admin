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
    const { appName, roleIds = [], ...reset } = createApplicationDto;
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
      ...reset
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

     // NOTE:  通过懒加载方式防止循环引入需要注意, roles返回的是一个promise对象需要处理
  // 处理用户数据的方法
  private async transformRole(app: Application) {
    const { roles,  ...result } = app;
    const array = await roles;
    const roleIds = (array || []).map(a => a.id); 

     //@ts-ignore
     //在 typeorm 中，当我们执行查询时，返回的实体对象通常包含所有属性，包括关系字段。为了确保返回的数据中不包含 __roles__，可以手动删除这些字段或者通过序列化的方法过滤它们
     delete result.__roles__;
    return { ...result, roleIds }; // 返回所有非密码属性和 roleIds
  }


  async getPage(query: QueryApplicationDto) {
    const { pageNum = 1, pageSize = 10, ...reset  } = query;
    const qb = await this.appRepository.createQueryBuilder('application')
    .leftJoinAndSelect('application.roles', 'roles');

    for (const key in reset) {
      if (this.columnNames.includes(key)) {
        qb.andWhere(`application.${key} LIKE :${key}`, { [key]: `%${reset[key]}%` });
      }
    }


    const [list, total] = await qb
      .take(pageSize)
      .skip(pageSize * (pageNum - 1))
      .getManyAndCount();
      
      const final = await Promise.all(list.map(o => this.transformRole(o))) 

      return { list: final, total };

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


  async findOne(id: number) {
    const res = await this.appRepository.createQueryBuilder('applications')
    .leftJoinAndSelect('applications.roles', 'roles')
    .andWhere(`applications.id = :id`, {id}).getOne();

    const final = await  this.transformRole(res);
    return final;
  }

  
}


