import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto, QueryRoleDto } from './dto/role.dto';
import { MyLogger } from 'core/middlewares/my-logger.service';
import { Role } from './entities/role.entity';
import { Application } from 'src/application/entities/application.entity';

@Injectable()
export class RoleService {
  columnNames: string[];

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Application)
    private readonly appRepository: Repository<Application>,
    private readonly myLogger: MyLogger,
  ) {
    // NOTE: 设置日志标识
    // Nest] 73420  - 2024/04/18 15:19:15     LOG [userService] 自定义日志信息...
    this.myLogger.setContext('roleService');

    // NOTE: 获取表结构字段
    const metadata = this.roleRepository.metadata;
    this.columnNames = metadata.columns.map((column) => column.propertyName);
  }

  async create(createRole: CreateRoleDto) {
    const { roleName, appIds = [], ...reset } = createRole;

    const has = await this.roleRepository.findOne({ where: { roleName } });
    if (has) {
      throw new HttpException('角色已存在', HttpStatus.OK);
    }

    let apps: Application[] = [];

    if (appIds?.length > 0) {
      apps = await this.appRepository.findBy({ id: In(appIds) });
    }

    const params = {
      apps,
      roleName,
      ...reset,
    };

    const res = await this.roleRepository.manager.transaction(
      async (manager) => {
        const newRole = manager.create(Role, params);
        return await manager.save(Role, newRole);
      },
    );

    if (res) {
      this.myLogger.log('角色创建成功');
    }

    return res;
  }

   // NOTE:  通过懒加载方式防止循环引入需要注意, roles返回的是一个promise对象需要处理
  // 处理用户数据的方法
  private async transformRole(role: Role) {
    const { apps,  ...result } = role;
    const appsArray = await apps;
    const appIds = (appsArray || []).map(a => a.id); 

     //@ts-ignore
     //在 typeorm 中，当我们执行查询时，返回的实体对象通常包含所有属性，包括关系字段。为了确保返回的数据中不包含 __roles__，可以手动删除这些字段或者通过序列化的方法过滤它们
     delete result.__apps__;
    return { ...result, appIds }; // 返回所有非密码属性和 roleIds
  }

  async getPage(query: QueryRoleDto) {
    const { pageNum = 1, pageSize = 10, ...reset } = query;
    const qb = await this.roleRepository.createQueryBuilder('roles');

    for (const key in reset) {
      if (this.columnNames.includes(key)) {
        qb.andWhere(`roles.${key} LIKE :${key}`, { [key]: `%${reset[key]}%` });
      }
    }

    const [list, total] = await qb
      .take(pageSize)
      .skip(pageSize * (pageNum - 1))
      .getManyAndCount();


    const final = await Promise.all(list.map(o => this.transformRole(o))) 
    return { list: final, total };

  }

  async getAll() {
 
    const list = await this.roleRepository.createQueryBuilder('roles').getMany();

    return list ;
  }

  async findOne(id: number) {
    const res = await this.roleRepository.createQueryBuilder('roles')
    .leftJoinAndSelect('roles.apps', 'apps')
    .andWhere(`roles.id = :id`, {id}).getOne();

    const final = await  this.transformRole(res);
    return final;
  }

  async update(updateRole: UpdateRoleDto) {
    const { id, appIds = [], ...reset } = updateRole;

    const exitsRole = await this.roleRepository.findOne({
      where: { id },
    });

    if (!exitsRole) {
      throw new HttpException('角色不存在', HttpStatus.OK);
    }

    for (const key in reset) {
      if (this.columnNames.includes(key)) {
        exitsRole[key] = updateRole[key];
      }
    }

    if (appIds?.length > 0) {
      const apps: Application[] = await this.appRepository.findBy({
        id: In(appIds),
      });
      exitsRole.apps = apps;
    }

    const res = await this.roleRepository.manager.transaction(
      async (manager) => {
        return await manager.save(Role, exitsRole);
      },
    );

    if (res) {
      this.myLogger.warn('角色信息修改');
    }

    return res;
  }

  async remove(id: number) {
    const exitsRole = await this.roleRepository.findOne({
      where: { id },
    });

    if (!exitsRole) {
      throw new HttpException('角色不存在', HttpStatus.OK);
    }

    const res = await this.roleRepository.manager.transaction(
      async (manager) => {
        return await manager.remove(Role, exitsRole);
      },
    );
    if (res) {
      this.myLogger.warn('角色删除');
    }
    return res;
  }

  async getRoleAuth(roleIds: number[]) {
    const has = await this.roleRepository.findBy({ id: In(roleIds) });
    // 
    return true;
  }
}
