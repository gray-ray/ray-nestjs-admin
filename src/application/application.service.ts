import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  CreateApplicationDto,
  QueryApplicationDto,
  UpdateApplicationDto,
} from './dto/application';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { MyLogger } from 'middlewares/my-logger.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepository: Repository<Application>,
    private readonly myLogger: MyLogger,
  ) {
    this.myLogger.setContext('appService');
  }

  async create(createApplicationDto: CreateApplicationDto) {
    const { appName } = createApplicationDto;
    const exitsApp = await this.appRepository.findOne({
      where: { appName },
    });
    if (exitsApp) {
      throw new HttpException('应用名称已存在', HttpStatus.OK);
    }

    const newApp = this.appRepository.create({ appName });

    const res = await this.appRepository.save(newApp).catch(() => false);

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

  async update(updateApp: UpdateApplicationDto) {
    const { appName } = updateApp;

    const exitsApp = await this.appRepository.findOne({
      where: { appName },
    });

    if (!exitsApp) {
      throw new HttpException('应用不存在', HttpStatus.OK);
    }

    // TODO: 角色 、产品

    const newApp = this.appRepository.merge(exitsApp, updateApp);

    const res = await this.appRepository.save(newApp);

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
    const res = await this.appRepository.remove(exitsApp);
    if (res) {
      this.myLogger.warn('应用删除');
    }
    return res;
  }
}
