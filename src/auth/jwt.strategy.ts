import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { secret } from './constants';

// 文档 https://docs.nestjs.cn/10/recipes?id=%e5%ae%9e%e7%8e%b0-passport-jwt
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // ignoreExpiration: 为了明确起见，我们选择默认的 false 设置，它将确保 JWT 没有过期的责任委托给 Passport 模块。
  // 这意味着，如果我们的路由提供了一个过期的 JWT ，请求将被拒绝，并发送 401 Unauthorized 的响应。Passport 会自动为我们办理。

  // jwtFromRequest:提供从请求中提取 JWT 的方法。
  // 我们将使用在 API 请求的授权头中提供token的标准方法。这里描述了其他选项。
  constructor() {
    // NOTE: 策略初始化参数
    super({
      ignoreExpiration: false,
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // validate() 方法值得讨论一下。对于 JWT 策略，Passport 首先验证 JWT 的签名并解码 JSON 。
  // 然后调用我们的 validate() 方法，该方法将解码后的 JSON 作为其单个参数传递。根据 JWT 签名的工作方式，我们可以保证接收到之前已签名并发给有效用户的有效 token 令牌

  async validate(payload: any) {
    return { id: payload.id, username: payload.username };
  }
}
