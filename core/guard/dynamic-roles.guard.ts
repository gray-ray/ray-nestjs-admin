import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { secret } from 'src/auth/constants';
import { RoleService } from 'src/role/role.service';
import { IS_PUBLIC_KEY } from 'core/decorators/public.decorator';

@Injectable()
export class DynamicRolesGuard implements CanActivate {
  private readonly whitelistRoutes: string[] = ['auth/login/*']; // 定义路由白名单
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // public 不进行获取用户token
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const token = request.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
      return false;
    }

    const tokenValue = token.substring(7);

    try {
      const decoded: any = jwt.verify(tokenValue, secret); // { username: 'user1', id: 3,role: '1,2,3', }
      // TODO: 用户角色信息判断是否有权限触发当前路由
      const res = await this.roleService.getRoleAuth(decoded?.role?.split(','));
      return res;
    } catch (error) {
      return false; // token 解码失败，拒绝访问
    }
  }
}
