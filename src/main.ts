import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MyLogger } from 'core/middlewares/my-logger.service';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'; //

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  const options = new DocumentBuilder()
    .setTitle('ray-nestjs-admin')
    .setDescription('基于nestjs实现的管理系统')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('admin', app, document);

  app.useLogger(new MyLogger());
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true, // 详细的错误 不会返回给用户
      // whitelist: true, // 传参中不需要的属性会自定删除
      transform: true, // 根据对象的 DTO 类自动将有效负载转换为对象类型
    }),
  );
  app.use(helmet()); // 众所周知的 Web 漏洞的影响

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.setGlobalPrefix('admin');
  await app.listen(3000);
}
bootstrap();
