import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';

import { TaskStatus } from './task-status.enum';
import { Transitions } from './task-transitions.enum';
import { TaskStatusHandler } from '../infra/task-status.handler';

@Injectable()
export class TaskDomainService {

    createNewTask(title: string, description: string): Task {
        const task = new Task();
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
}
