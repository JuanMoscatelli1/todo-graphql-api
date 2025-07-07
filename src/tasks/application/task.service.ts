import { Inject, Injectable } from '@nestjs/common';
import { Transitions } from '../domain/task-transitions.enum';
import { TaskDomainService } from '../domain/task.domain.service';
import { ITaskRepository } from '../domain/task.repository.interface';
import { UpdateTaskDTO } from './update-task.dto';
import { TaskMapper } from './task-mapper';
import { TaskFilterInput } from '../presentation/task-filter.input';
import { TaskOrderInput } from '../presentation/task-order.input';
import { TaskDTO } from './task.dto';
import { IUserRepository } from '../../user/domain/user.repository.interface';
import { Task } from '../domain/task.entity';

@Injectable()
export class TaskService {

    constructor(
        @Inject('ITaskRepository')
        private readonly taskRepository: ITaskRepository,
        private readonly taskDomainService: TaskDomainService,
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository) { }

    async findFilteredTasks(
        userId: number,
        filters: Partial<TaskFilterInput>,
        order: Partial<TaskOrderInput>
    ): Promise<TaskDTO[]> {
        //sobreescribe el filter de user con el suyo
        const completeFilters: Partial<TaskFilterInput> = {
            ...filters,
            userId,
        };
        const tasks = await this.taskRepository.findWithFilters(completeFilters, order);
        return tasks.map(task => TaskMapper.toDTO(task));
    }

    async findAllTasksForAdmin(
        filters: Partial<TaskFilterInput>,
        order: Partial<TaskOrderInput>
    ): Promise<TaskDTO[]> {
        const tasks = await this.taskRepository.findWithFilters(filters, order);
        return tasks.map(task => TaskMapper.toDTO(task));
    }

    private async findTaskById(taskId: number): Promise<Task> {
        const task = await this.taskRepository.findOne(taskId);
        if (!task) throw new Error('Task not found');
        return task;
    }

    async createTask(title: string, description: string, userId: number): Promise<TaskDTO> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const task = this.taskDomainService.createNewTask(title, description, user);
        const savedTask = await this.taskRepository.save(task);
        return TaskMapper.toDTO(savedTask);
    }

    async changeTaskStatusById(taskId: number, action: Transitions, userId: number): Promise<TaskDTO> {
        const task = await this.findTaskById(taskId);
        this.taskDomainService.validateTaskOwnership(task, userId);
        this.taskDomainService.changeStatus(task, action);
        const savedTask = await this.taskRepository.save(task);
        return TaskMapper.toDTO(savedTask);
    }

    async deleteTask(taskId: number, userId: number): Promise<void> {
        const task = await this.findTaskById(taskId);
        this.taskDomainService.validateTaskOwnership(task, userId);
        await this.taskDomainService.softDelete(task);
    }

    async updateTask(dto: UpdateTaskDTO, userId: number): Promise<TaskDTO> {
        const task = await this.findTaskById(dto.taskId);
        this.taskDomainService.validateTaskOwnership(task, userId);
        TaskMapper.updateEntityFromDto(task, dto);
        const savedTask = await this.taskRepository.save(task);
        return TaskMapper.toDTO(savedTask);
    }

}
