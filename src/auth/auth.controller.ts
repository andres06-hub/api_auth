import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataLoginDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { DataSignUp } from './dto/signUp.dto';
import { Response } from 'src/common/interfaces/response';

@Controller('auth')
export class AuthController {
  constructor(private _authSrv: AuthService) {}

  logger = new Logger();

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async login(@Body() data: DataLoginDto): Promise<HttpException | Response> {
    const { email, password } = data;
    const result: HttpException | Response = await this._authSrv.login(
      email,
      password,
    );
    return result;
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async signUp(@Body() data: DataSignUp): Promise<Response> {
    return await this._authSrv.signUp(data);
  }
}
