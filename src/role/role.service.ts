import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto, QueryRoleDto } from './dto/role.dto';
import { MyLogger } from 'middlewares/my-logger.service';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  columnNames: string[];

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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
    const { roleName } = createRole;

    const has = await this.roleRepository.findOne({ where: { roleName } });
    if (has) {
      throw new HttpException('角色已存在', HttpStatus.OK);
    }
    const newRole = await this.roleRepository.create(createRole);

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
    const { id } = updateRole;

    const exitsRole = await this.roleRepository.findOne({
      where: { id },
    });

    if (!exitsRole) {
      throw new HttpException('角色不存在', HttpStatus.OK);
    }

    const newRole = this.roleRepository.merge(exitsRole, updateRole);

    const res = await this.roleRepository.save(newRole);

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
