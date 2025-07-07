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

    validateTaskOwnership(task: Task, userId: number): void {
        if (task.user?.id !== userId) throw new Error('No autorizado');
    }

    createNewTask(title: string, description: string, user: User): Task {
        if (!title || title.trim() === '') {
            throw new Error('El titulo es obligatorio');
        }

        if (!description || description.trim() === '') {
            throw new Error('La descripcion es obligatoria');
        }

        const task = new Task();
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
