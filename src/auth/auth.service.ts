import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByName(username);
    // TODO: 密码解密处理
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: AuthLoginDto) {
    const payload = { username: user.username, id: user.id };
    return {
      // 该库提供了一个 sign() 函数，用于从用户对象属性的子集生成 jwt
      access_token: this.jwtService.sign(payload),
    };
  }
}
