import { Controller, Param, Post, Body } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Controller('api/v1/auth')
export class AuthController {
  @Post('/login')
  Login(@Body('email') email: string, @Body('password') password: string): any {
    return { email, password };
  }

  @Post('/register')
  Register(
    @Param('first_name') first_name: string,
    @Param('last_name') last_name: string,
    @Param('email') email: string,
    @Param('password') password: string,
  ): string {
    console.log(first_name, last_name, email, password);
    return 'ok';
  }

  @Post('/forgot-password')
  ForgotPassword(@Param('email') email: string): string {
    console.log(email);
    return 'ok';
  }

  @Post('/reset-password')
  ResetPassword(
    @Param('code') code: string,
    @Param('password') password: string,
    @Param('repeat_password') repeat_password: string,
  ): string {
    console.log(code);
    return 'ok';
  }

  @Post('/logout')
  Logout(): string {
    return 'ok';
  }
}
