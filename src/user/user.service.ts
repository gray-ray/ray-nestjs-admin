import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto/user.dto';
import { MyLogger } from 'core/middlewares/my-logger.service';
import { User } from './entities/user.entity';

import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UserService {
  columnNames: string[];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly myLogger: MyLogger,
  ) {
    // NOTE: 设置日志标识
    // Nest] 73420  - 2024/04/18 15:19:15     LOG [userService] 自定义日志信息...
    this.myLogger.setContext('userService');

    // NOTE: 获取表结构字段
    const metadata = this.userRepository.metadata;
    this.columnNames = metadata.columns.map((column) => column.propertyName);
  }

  async create(createUser: CreateUserDto) {
    const { username, roleIds = [], ...reset } = createUser;

    const has = await this.userRepository.findOne({ where: { username } });
    if (has) {
      throw new HttpException('用户已存在', HttpStatus.OK);
    }

    let roles: Role[] = [];
    if (roleIds?.length > 0) {
      roles = await this.roleRepository.findBy({ id: In(roleIds) });
    }

    const params = {
      roles,
      username,
      ...reset,
    };

    const res = await this.userRepository.manager.transaction(
      async (manager) => {
        const newUser = manager.create(User, params);
        return await manager.save(User, newUser);
      },
    );

    if (res) {
      this.myLogger.log('用户创建成功');
    }

    return null;
  }

  async getPage(query: QueryUserDto) {
    const { pageNum = 1, pageSize = 10, ...reset } = query;
    const qb = await this.userRepository.createQueryBuilder('users');

    for (const key in reset) {
      if (this.columnNames.includes(key)) {
        qb.andWhere(`users.${key} LIKE :${key}`, { [key]: `%${reset[key]}%` });
      }
    }

    const [list, total] = await qb
      .take(pageSize)
      .skip(pageSize * (pageNum - 1))
      .getManyAndCount();

    return { list, total };
  }

  async findOne(id: number) {
    const res = await this.userRepository.findOne({ where: { id } });
    return res;
  }

  // 返回用户密码信息
  async findOneByName(username: string) {
    const qb = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .addSelect('users.username')
      .addSelect('users.id')
      .addSelect('roles.id', 'roleId') // 选择角色的ID
      .leftJoin('users.roles', 'roles')
      .where('users.username = :username', { username })
      .getRawMany();

    // NOTE:  返回类似下面的数据结构
    /**
     * [
  {
    users_id: 3,
    users_username: 'user1',
    users_nickname: 'string',
    users_status: 0,
    users_create_time: 2024-05-15T03:24:41.000Z,
    users_update_time: 2024-05-15T03:24:41.000Z,
    users_email: '122988282@qq.com',
    users_phone: 'string',
    users_remark: 'user1',
    users_password: '$2a$10$kc4UwG6pi0a2TMe7v.nQ2OE0R5qrGSas2dWQjFPdgSe7SqWGeVwDq',
    roleId: 1,
    password: '$2a$10$kc4UwG6pi0a2TMe7v.nQ2OE0R5qrGSas2dWQjFPdgSe7SqWGeVwDq'
  },
  {
    users_id: 3,
    users_username: 'user1',
    users_nickname: 'string',
    users_status: 0,
    users_create_time: 2024-05-15T03:24:41.000Z,
    users_update_time: 2024-05-15T03:24:41.000Z,
    users_email: '122988282@qq.com',
    users_phone: 'string',
    users_remark: 'user1',
    users_password: '$2a$10$kc4UwG6pi0a2TMe7v.nQ2OE0R5qrGSas2dWQjFPdgSe7SqWGeVwDq',
    roleId: 2,
    password: '$2a$10$kc4UwG6pi0a2TMe7v.nQ2OE0R5qrGSas2dWQjFPdgSe7SqWGeVwDq'
  }
]
     */

    if (qb?.length <= 0) return undefined;

    const first = qb[0];

    const roleIds = qb?.map((o) => o?.roleId);
    first.roleIds = roleIds;

    return first;
  }

  async update(updateUser: UpdateUserDto) {
    const { id, roleIds = [], ...reset } = updateUser;

    const exitsUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!exitsUser) {
      throw new HttpException('用户不存在', HttpStatus.OK);
    }

    for (const key in reset) {
      if (this.columnNames.includes(key)) {
        exitsUser[key] = reset[key];
      }
    }

    if (roleIds?.length > 0) {
      const roles: Role[] = await this.roleRepository.findBy({
        id: In(roleIds),
      });
      exitsUser.roles = roles;
    }

    // 使用 merge 方法合并实体时，它不会自动保存关联实体（例如 roles）。需要手动保存这些关联实体才能确保它们的变更生效。
    const res = await this.userRepository.manager.transaction(
      async (manager) => {
        return await manager.save(User, exitsUser);
      },
    );

    if (res) {
      this.myLogger.warn('用户信息修改');
    }

    return null;
  }

  async remove(id: number) {
    const exitsUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!exitsUser) {
      throw new HttpException('用户不存在', HttpStatus.OK);
    }

    const res = await this.userRepository.manager.transaction(
      async (manager) => {
        return await manager.remove(User, exitsUser);
      },
    );
    if (res) {
      this.myLogger.warn('用户删除');
    }
    return null;
  }
}
