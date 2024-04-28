// 创建类替换其中的 字符串

import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'core/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // 在这里添加您自定义的认证逻辑
    // 例如，调用 super.logIn(request) 来建立一个 session
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // user { id: string, username: string }
    // 您可以基于 "info" 或 "err" 参数抛一个错误
    if (err || !user) {
      throw err || new UnauthorizedException('用户未登录');
    }
    return user;
  }
}
