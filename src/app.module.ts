import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import envConfig from '../config/env';
import { APP_FILTER, APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { ApplicationModule } from './application/application.module';

import { HttpExceptionFilter } from 'core/filters/http-exception.filter';
import { ValidationPipe } from 'core/pipes/validate.pipe';
import { ResponseInterceptor } from 'core/interceptor/response.interceptor';
import { AuthModule } from './auth/auth.module';

// 全局模块 在根模引入后， 在其他模块使用userModule 不在需要在其他模块中导入userModule
// imports 是最优的

// @Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [envConfig.path] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService], //依赖注入 ConfigService
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get('DB_DATABASE'))
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true, // 生产环境关闭
          logging: ['error'], //启用数据库查询日志
          maxQueryExecutionTime: 1000, // 记录所有运行超过1秒的查询
          logger: 'file', // 将所有日志写入项目根文件夹中的ormlogs.log
        };
      },
    }),
    UserModule,
    RoleModule,
    MenuModule,
    ApplicationModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
