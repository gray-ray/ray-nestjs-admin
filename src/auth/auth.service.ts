import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth.dto';
import { compareSync } from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /** local.strategy.js 调用  */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByName(username);
    // TODO: 密码解密处理
    if (!user) {
      throw new BadRequestException('用户名不正确');
    }

    const isMatch = compareSync(pass, user.password);

    if (!isMatch) {
      throw new BadRequestException('密码不正确');
    }

    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      id: user.id,
      role: user?.roleIds?.join(','),
    };

    return {
      // 该库提供了一个 sign() 函数，用于从用户对象属性的子集生成 jwt
      access_token: this.jwtService.sign(payload),
    };
  }
}
