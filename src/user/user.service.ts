import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto/user.dto';
import { MyLogger } from 'middlewares/my-logger.service';
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

    const newUser = await this.userRepository.create(params);

    const res = await this.userRepository.save(newUser);

    if (res) {
      this.myLogger.log('用户创建成功');
    }

    return res;
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

  async update(updateUser: UpdateUserDto) {
    const { id } = updateUser;

    const exitsUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!exitsUser) {
      throw new HttpException('用户不存在', HttpStatus.OK);
    }

    // TODO: 角色 、产品

    const newUser = this.userRepository.merge(exitsUser, updateUser);

    const res = await this.userRepository.save(newUser);

    if (res) {
      this.myLogger.warn('用户信息修改');
    }

    return res;
  }

  async remove(id: number) {
    const exitsUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!exitsUser) {
      throw new HttpException('用户不存在', HttpStatus.OK);
    }
    const res = await this.userRepository.remove(exitsUser);
    if (res) {
      this.myLogger.warn('用户删除');
    }
    return res;
  }
}
