import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // NOTE: 返回原始数据结构不进行 RESTful处理
    const isCustomResponse = Reflect.getMetadata(
      'customResponse',
      context.getHandler(),
    );

    if (isCustomResponse) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        return {
          status: context.switchToHttp().getResponse().statusCode,
          data,
          success: true,
          message: '成功',
        };
      }),
    );
  }
}
