import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { MyLogger } from 'core/middlewares/my-logger.service';
import { Application } from './entities/application.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { Role } from 'src/role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Menu, Role])],
  controllers: [ApplicationController],
  providers: [ApplicationService, MyLogger],
})
export class ApplicationModule {}
