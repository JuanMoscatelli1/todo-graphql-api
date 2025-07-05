import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './domain/user.entity';
import { UserRepository } from './infra/user.repository';

import { AuthModule } from '../auth/auth.module';
import { UserDomainService } from './domain/user.domain.service';
import { UserService } from './application/user.service';
import { UserResolver } from './presentation/user.resolver';
import { RolesModule } from '../roles/roles.module';
import { Task } from '../tasks/domain/task.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Task]), forwardRef(() => AuthModule), RolesModule],
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
