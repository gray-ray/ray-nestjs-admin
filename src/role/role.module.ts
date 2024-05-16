import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { MyLogger } from 'core/middlewares/my-logger.service';
import { Role } from './entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { Application } from 'src/application/entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Application])],
  controllers: [RoleController],
  providers: [RoleService, MyLogger],
})
export class RoleModule {}
