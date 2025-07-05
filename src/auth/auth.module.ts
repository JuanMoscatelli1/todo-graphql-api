import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './application/auth.service';
import { AuthResolver } from './presentation/auth.resolver';
import { JwtStrategy } from './infra/jwt.strategy';
import { GqlAuthGuard } from './infra/gql-auth.guard';

import { JwtService } from './infra/jwt.service';
import { UserModule } from '../user/user.module';
import { BcryptHasher } from './infra/bcrypt.hasher';
import { AuthDomainService } from './domain/auth.domain.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  providers: [
    AuthService,
    AuthDomainService,
    AuthResolver,
    JwtStrategy,
    GqlAuthGuard,

    {
      provide: 'IPasswordHasher',
      useClass: BcryptHasher,
    },
    {
      provide: 'IJwtService',
      useClass: JwtService,
    },
  ],
  exports: ['IPasswordHasher', 'IJwtService'],
})
export class AuthModule { }
