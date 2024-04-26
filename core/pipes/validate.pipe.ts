/**
 * @description 管道 转换 /验证  全局注册后在 dto文件中添加对应的规则即可
 *
 */

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    console.log('触发全局管道校验');
    let str = '';
    if (errors.length > 0) {
      errors?.forEach((o) => {
        str += Object.values(o?.constraints) ?? '参数异常';
      });

      const errorResponse = {
        code: 400,
        message: str,
        error: 'Bad Request',
        success: false,
      };
      throw new BadRequestException(errorResponse);
    }
    return value;
  }

  private toValidate(metaType: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }
}
