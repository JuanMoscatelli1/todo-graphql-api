import { Inject, Injectable } from '@nestjs/common';
import { Task } from './task.entity';

import { TaskStatus } from './task-status.enum';
import { Transitions } from './task-transitions.enum';
import { TaskStatusHandler } from '../infra/task-status.handler';
import { ITaskRepository } from './task.repository.interface';
import { User } from '../../user/domain/user.entity';

@Injectable()
export class TaskDomainService {
    constructor(
        @Inject('ITaskRepository')
        private readonly taskRepository: ITaskRepository) { }

    async findAndValidateTask(taskId: number, userId: number): Promise<Task> {
        //tira error por lo del null sino chequeo todo junto
        const task = await this.taskRepository.findOne(taskId);
        if (!task) throw new Error('Task not found');
        if (task.user?.id !== userId) throw new Error('No autorizado');
        return task;
    }

    createNewTask(title: string, description: string, userId: number): Task {
        const task = new Task();
        const user = new User();
        user.id = userId;

        task.user = user;;
        task.title = title;
        task.description = description;
        task.status = TaskStatus.PENDING;
        task.createdAt = new Date();
        return task;
    }

    changeStatus(task: Task, action: Transitions): void {
        const newStatus = TaskStatusHandler.handle(action, task.status);
        task.status = newStatus;
    }

    async softDelete(task: Task): Promise<void> {
        await this.taskRepository.softRemove(task);
    }
}
