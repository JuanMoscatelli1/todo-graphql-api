import { Inject, Injectable } from '@nestjs/common';
import { Transitions } from '../domain/task-transitions.enum';
import { TaskDomainService } from '../domain/task.domain.service';
import { Task } from '../domain/task.entity';
import { ITaskRepository } from '../domain/task.repository.interface';
import { TaskDTO } from './task.dto';

@Injectable()
export class TaskService {
    constructor(
        @Inject('ITaskRepository')
        private readonly taskRepository: ITaskRepository,
        private readonly taskDomainService: TaskDomainService) { }

    async findAll(): Promise<Task[]> {
        return await this.taskRepository.findAll();
    }

    async createTask(title: string, description: string): Promise<Task> {
        return this.taskDomainService.createNewTask(title, description);
    }

    async changeTaskStatusById(taskId: number, action: Transitions): Promise<Task> {
        const task = await this.taskRepository.findOne(taskId);
        if (!task) {
            throw new Error(`Task with id ${taskId} not found`);
        }
        this.taskDomainService.changeStatus(task, action);
        return await this.taskRepository.save(task);
    }
}
