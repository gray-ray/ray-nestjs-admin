import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth.dto';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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

  async login(user: AuthLoginDto) {
    const payload = { username: user.username, id: user.id };
    return {
      // 该库提供了一个 sign() 函数，用于从用户对象属性的子集生成 jwt
      access_token: this.jwtService.sign(payload),
    };
  }
}
