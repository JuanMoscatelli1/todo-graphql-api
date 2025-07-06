import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CreateUserCommand } from './create-user.cli';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/domain/task.entity';
import { User } from 'src/user/domain/user.entity';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Task],
      synchronize: true,     
    })
  ],
  providers: [CreateUserCommand],
})
export class CliModule { }
