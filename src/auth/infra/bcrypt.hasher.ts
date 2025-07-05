import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../domain/password.hasher.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptHasher implements IPasswordHasher {
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
