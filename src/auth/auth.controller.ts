import { Body, Controller, Post } from '@nestjs/common';
import { DataLoginDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private _authSrv: AuthService) {}

  @Post()
  login(@Body() data: DataLoginDto) {
    this._authSrv.getUser(data);
  }
}
