import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from './user.repository.interface';
import { IPasswordHasher } from '../../auth/domain/password.hasher.interface';
import { User } from './user.entity';

@Injectable()
export class UserDomainService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) { }

  async register(username: string, plainPassword: string): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) throw new Error('Username already exists');

    const hashedPassword = await this.passwordHasher.hash(plainPassword);
    const user = new User();
    user.username = username;
    user.password = hashedPassword;

    return user;
  }
}
