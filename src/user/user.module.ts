import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './domain/user.entity';
import { UserRepository } from './infra/user.repository';

import { AuthModule } from '../auth/auth.module';
import { UserDomainService } from './domain/user.domain.service';
import { UserService } from './application/user.service';
import { UserResolver } from './presentation/user.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule),],
    providers: [
        UserService,
        UserDomainService,
        UserResolver,
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
    ],
    exports: [UserService, 'IUserRepository'],
})
export class UserModule { }
