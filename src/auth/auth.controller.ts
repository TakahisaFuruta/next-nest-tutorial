import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Msg } from './interfaces/auth.interface';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // nestではsuccessはすべてhttp status code 201 (create)になってしまう
  // signupの場合はuserをcreateするのでいいが他の場合(例えばログイン)はデコレータで上書きする
  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Msg> {
    return this.authService.signUp(dto);
  }

  // passthrough: trueにする意図
  // 通常nestではresponseで返すオブジェクトを自動でjsonにシリアライズしてくれるstandardモードになっている
  // ただし、このstandardではresponseにcookieをセットするexpressの機能は使えない
  // そのためcookieをセットするために@Resデコレータでexpressのresponseに切り替えている
  // しかしexpressのResponseはオブジェクトをjsonシリアライズしてくれないので、ここだけnestの機能を使いたい
  // この設定をいれるとnestのresponse, expressのresponseの両機能を使うことができる
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.login(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false, // localではpostmanで動作確認するのでfalse.本番ではtrueでhttpsオンリーにする必要ある
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'OK',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Msg {
    res.cookie('access_token', '', {
      httpOnly: true, // localではpostmanで動作確認するのでfalse.本番ではtrueでhttpsオンリーにする必要ある
      secure: false,
      sameSite: 'none',
      path: '/',
    });

    return {
      message: 'OK',
    };
  }
}
