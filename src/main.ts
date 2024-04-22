import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MyLogger } from 'middlewares/my-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

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
  await app.listen(3000);
}
bootstrap();
