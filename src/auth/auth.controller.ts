import {
  Controller,
  Post,
  Req,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CustomResponse } from 'core/decorators/custom.decorator';
import { AuthService } from './auth.service';
import { ResponseInterceptor } from 'core/interceptor/response.interceptor';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from 'core/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @CustomResponse() // 重写全局返回拦截器
  @UseInterceptors(ResponseInterceptor) // 重写全局返回拦截器
  signIn(@Req() req) {
    // req.user; // User
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Req() req) {
  //   return req.user;
  // }
}
