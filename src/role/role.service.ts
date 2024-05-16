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

    const newRole = await this.roleRepository.create(params);

    const res = await this.roleRepository.save(newRole);
    if (res) {
      this.myLogger.log('角色创建成功');
    }

    return res;
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

    return { list, total };
  }

  async findOne(id: number) {
    const res = await this.roleRepository.findOne({ where: { id } });
    return res;
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

    const res = await this.roleRepository.save(exitsRole);

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
    const res = await this.roleRepository.remove(exitsRole);
    if (res) {
      this.myLogger.warn('角色删除');
    }
    return res;
  }
}
