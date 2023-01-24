import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class BcryptService {
  async bcryptToHash(data: string): Promise<string> {
    return await hash(data, 10);
  }

  async unencrypt(dataHash: string, dataTocompare: string): Promise<boolean> {
    return await compare(dataTocompare, dataHash);
  }
}
