import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import { hash, compare } from 'bcrypt';
import { DataSignUp } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}
  private logger = new Logger();

  async login(email: string, password: string): Promise<User | null> {
    const findUser: User | null | false = await this.findOneByMail(email);
    console.log('USER::', findUser);
    if (!findUser) return null; // NOt found
    //Validate pass
    const pwd: boolean = await this.unencrypt(findUser.password, password);
    console.log(pwd);
    //Create JWT
    //Return JWT
    return;
  }

  async createUser(data: DataSignUp): Promise<User | null | false> {
    const findUser: User | null | false = await this.findOneByMail(data.email);
    //TODO: mejorar los return cuando haya un error
    if (findUser === false) return false; //Error
    if (!findUser) return null; // Not Found

    const { password } = data;
    //bcrypt psw
    const pwdToHash: string = await this.bcryptToHash(password);
    // Save DB
    data = { ...data, password: pwdToHash };
    const newUser: User = this.userRepository.create(data);
    this.userRepository.save(newUser);
    return newUser;
  }

  //DB
  async findOneByMail(email: string): Promise<User | null | false> {
    try {
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

  //TODO: CREATE SERVICES FOR BCRYPT
  async bcryptToHash(data: string): Promise<string> {
    console.log('JII');
    const x = await hash(data, 10);
    console.log('JII');
    return x;
  }

  async unencrypt(dataHash: string, dataTocompare: string): Promise<boolean> {
    return await compare(dataTocompare, dataHash);
  }
}
