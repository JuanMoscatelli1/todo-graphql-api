import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CreateUserCommand } from './create-user.cli';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'todo_db',
      autoLoadEntities: true,
      synchronize: true,      // en dev, auto crea tablas, no usar en prod
    })
  ],
  providers: [CreateUserCommand],
})
export class CliModule { }
