import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import { DataSignUp } from './dto/signUp.dto';
import { BcryptService } from 'src/common/services/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from './dto/response';
import { HttpError } from 'src/common/interfaces/error.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRpt: Repository<User>,
    private _bcryptSrv: BcryptService,
    private _jwtSrv: JwtService,
  ) {}
  private logger = new Logger();

  // eslint-disable-next-line prettier/prettier
  async login(email: string, password: string): Promise<Response> {
    const findUser: User | null | false = await this.findOneByMail(email);
    if (findUser === null || findUser === false)
      throw new NotFoundException(new Response(false, 'Not Found!')); // NOt found
    this.logger.log('User Exists!');
    //Validate pass
    const pwd: boolean = await this._bcryptSrv.unencrypt(
      findUser.password,
      password,
    );
    if (!pwd)
      throw new ForbiddenException(
        new Response(false, 'Incorrect credentials'),
      );
    console.log(pwd);
    //Create JWT
    const payload = {
      id: findUser.id,
      username: findUser.username,
    };
    const token = this._jwtSrv.sign(payload);
    //Return JWT
    return new Response(true, 'Login Sucessfully', { token });
  }

  async signUp(data: DataSignUp): Promise<Response> {
    const found: User | boolean | null = await this.findOneByMail(data.email);
    if (found) {
      this.logger.warn('The user exists!');
      return new Response(false, 'user exists!');
    }
    if (found === false)
      throw new InternalServerErrorException(
        'ERROR: When searching for the user',
      );
    return this.createUser(data);
  }

  async createUser(data: DataSignUp): Promise<Response> {
    const { password } = data;
    //bcrypt psw
    const pwdToHash: string = await this._bcryptSrv.bcryptToHash(password);
    data = { ...data, password: pwdToHash };
    this.logger.log('Creading User...');
    // Save DB
    const newUser: User = this.userRpt.create(data);
    this.userRpt.save(newUser);
    this.logger.log(newUser);
    return new Response(true, 'User created successfully', { newUser });
  }

  async findOneByMail(email: string): Promise<User | null | false> {
    try {
      this.logger.log('looking for user...');
      const findUser: User | null = await this.userRpt.findOne({
        where: {
          email: email,
        },
      });
      return findUser;
    } catch (e) {
      const error: HttpError = e.driverError.detail as HttpError;
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findOneById(id: number): Promise<User | null | false> {
    try {
      this.logger.log('looking for user...');
      const findUser: User | null = await this.userRpt.findOne({
        where: {
          id: id,
        },
      });
      return findUser;
    } catch (e) {
      const error: HttpError = e.driverError.detail as HttpError;
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
