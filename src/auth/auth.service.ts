import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataLoginDto } from './dto/login-auth.dto';
import { User } from 'src/models/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async getUser(data: DataLoginDto): Promise<User> {
    // Validate si existe
    const { email, password } = data;
    const findUser: User | null = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    console.log('USER::', findUser);
    //DB
    //Validate pass
    //Create JWT
    //Return JWT
    return;
  }
}
