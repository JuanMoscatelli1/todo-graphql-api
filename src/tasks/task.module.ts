import { Module } from '@nestjs/common';
import { TaskDomainService } from './domain/task.domain.service';
import { TaskService } from './application/task.service';
import { TaskResolver } from './presentation/task.resolver';
import { RolesModule } from 'src/roles/roles.module';
import { Task } from './domain/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/domain/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Task, User]), RolesModule],
    providers: [
        TaskDomainService,
        TaskService,
        TaskResolver,
    ],
    exports: [],
})
export class TaskModule { }
