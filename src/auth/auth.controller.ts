import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { DataLoginDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { DataSignUp } from './dto/signUp.dto';
import { User } from 'src/models/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private _authSrv: AuthService) {}

  logger = new Logger();

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: DataLoginDto) {
    const { email, password } = data;
    const result: string | null | boolean = await this._authSrv.login(
      email,
      password,
    );
    if (!result) throw new NotFoundException('Not Found!');
    if (result === 'incorrect') throw new ForbiddenException();
    return { token: result };
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() data: DataSignUp) {
    const found: User | boolean | null = await this._authSrv.findOneByMail(
      data.email,
    );
    if (found) {
      this.logger.warn('The user exists!');
      return { message: 'The user Exists!' };
    }
    if (found === false)
      throw new InternalServerErrorException(
        'ERROR: When searching for the user',
      );
    const result: User | boolean = await this._authSrv.createUser(data);
    if (!result) return;
    this.logger.log('User Created!');
    return {
      message: 'User Created!',
    };
  }
}
