import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataLoginDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { DataSignUp } from './dto/signUp.dto';
import { Response } from 'src/common/interfaces/response';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private _authSrv: AuthService) {}

  logger = new Logger();

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
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

  //? TODO: This is an example to show how to get the payload data
  @Get('example')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async ex(@Req() dataUser: any) {
    console.log('Data: ', dataUser.user);
    return new Response(true, 'JI');
  }
}
