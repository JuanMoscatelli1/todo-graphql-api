import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './tasks/task.module';
import { Task } from './tasks/domain/task.entity';
import { User } from './user/domain/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const isTest = process.env.NODE_ENV === 'test';

        return isTest
          ? {
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: [User, Task],
            synchronize: true,
          }
          : {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT ?? '5432'),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [User, Task],
            synchronize: true, // o false en producción
          };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      sortSchema: true,
      introspection: true,
      csrfPrevention: true,
      context: ({ req }) => ({ req }),
    }),
    UserModule,
    AuthModule,
    TaskModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
