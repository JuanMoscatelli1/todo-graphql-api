import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../user/domain/user.repository.interface';
import { IPasswordHasher } from '../domain/password.hasher.interface';
import { User } from '../../user/domain/user.entity';

@Injectable()
export class AuthDomainService {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('IPasswordHasher')
        private readonly passwordHasher: IPasswordHasher,
    ) { }

    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userRepository.findByUsername(username);
        if (!user) throw new Error('Invalid credentials');

        const isPasswordValid = await this.passwordHasher.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Invalid credentials');

        return user;
    }
}
