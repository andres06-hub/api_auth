import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import { DataSignUp } from './dto/signUp.dto';
import { BcryptService } from 'src/common/services/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private _bcryptSrv: BcryptService,
    private _jwtSrv: JwtService,
  ) {}
  private logger = new Logger();

  // eslint-disable-next-line prettier/prettier
  async login(email: string, password: string): Promise<string | boolean | null> {
    const findUser: User | null | false = await this.findOneByMail(email);
    if (findUser === null) return null; // NOt found
    if (findUser === false) return false; //Error
    this.logger.log('User Exists!');
    //Validate pass
    const pwd: boolean = await this._bcryptSrv.unencrypt(
      findUser.password,
      password,
    );
    if (!pwd) return 'incorrect';
    console.log(pwd);
    //Create JWT
    const payload = {
      id: findUser.id,
      username: findUser.username,
    };
    const token = this._jwtSrv.sign(payload);
    //Return JWT
    return token;
  }

  async createUser(data: DataSignUp): Promise<User | boolean> {
    const { password } = data;
    //bcrypt psw
    const pwdToHash: string = await this._bcryptSrv.bcryptToHash(password);
    data = { ...data, password: pwdToHash };
    this.logger.log('Creading User...');
    // Save DB
    const newUser: User = this.userRepository.create(data);
    this.userRepository.save(newUser);
    this.logger.log(newUser);
    return newUser;
  }

  //DB
  async findOneByMail(email: string): Promise<User | null | false> {
    try {
      this.logger.log('looking for user...');
      const findUser: User | null = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
      return findUser;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
