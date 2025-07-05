import { Inject, Injectable } from '@nestjs/common';
import { Transitions } from '../domain/task-transitions.enum';
import { TaskDomainService } from '../domain/task.domain.service';
import { Task } from '../domain/task.entity';
import { ITaskRepository } from '../domain/task.repository.interface';
import { UpdateTaskDTO } from './update-task.dto';
import { TaskMapper } from './task-mapper';
import { TaskFilterInput } from '../presentation/task-filter.input';
import { TaskOrderInput } from '../presentation/task-order.input';

@Injectable()
export class TaskService {

    async findFilteredTasks(
        userId: number,
        filters: Partial<TaskFilterInput>,
        order: Partial<TaskOrderInput>
    ): Promise<Task[]> {
        //sobreescribe el filter de user con el suyo
        const completeFilters: Partial<TaskFilterInput> = {
            ...filters,
            userId,
        };
        return this.taskRepository.findWithFilters(completeFilters, order);
    }

    async findAllTasksForAdmin(
        filters: Partial<TaskFilterInput>,
        order: Partial<TaskOrderInput>
    ): Promise<Task[]> {
        return this.taskRepository.findWithFilters(filters, order);
    }

    constructor(
        @Inject('ITaskRepository')
        private readonly taskRepository: ITaskRepository,
        private readonly taskDomainService: TaskDomainService) { }

    async createTask(title: string, description: string, userId: number): Promise<Task> {
        const task = this.taskDomainService.createNewTask(title, description, userId);
        return await this.taskRepository.save(task);
    }

    async changeTaskStatusById(taskId: number, action: Transitions, userId: number): Promise<Task> {
        const task = await this.taskDomainService.findAndValidateTask(taskId, userId);
        this.taskDomainService.changeStatus(task, action);
        return await this.taskRepository.save(task);
    }

    async deleteTask(taskId: number, userId: number): Promise<void> {
        const task = await this.taskDomainService.findAndValidateTask(taskId, userId);
        await this.taskDomainService.softDelete(task);
    }

    async updateTask(dto: UpdateTaskDTO, userId: number): Promise<Task> {
        const task = await this.taskDomainService.findAndValidateTask(dto.taskId, userId);

        TaskMapper.updateEntityFromDto(task, dto);

        return await this.taskRepository.save(task);
    }



}
