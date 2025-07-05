import { Module } from '@nestjs/common';
import { TaskDomainService } from './domain/task.domain.service';
import { TaskService } from './application/task.service';
import { TaskResolver } from './presentation/task.resolver';
import { RolesModule } from 'src/roles/roles.module';
import { Task } from './domain/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/domain/user.entity';
import { TaskRepository } from './infra/task.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Task, User]), RolesModule],
    providers: [
        TaskDomainService,
        TaskService,
        TaskResolver,
        {
            provide: 'ITaskRepository',
            useClass: TaskRepository,
        },
    ],
    exports: [],
})
export class TaskModule { }
