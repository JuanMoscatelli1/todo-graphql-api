import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskDomainService } from '../domain/task.domain.service';
import { ITaskRepository } from '../domain/task.repository.interface';
import { IUserRepository } from '../../user/domain/user.repository.interface';
import { Task } from '../domain/task.entity';
import { User } from '../../user/domain/user.entity';
import { TaskStatus } from '../domain/task-status.enum';
import { Transitions } from '../domain/task-transitions.enum';
import { UpdateTaskDTO } from './update-task.dto';
import { TaskMapper } from './task-mapper';

describe('TaskService', () => {
    let service: TaskService;
    let taskRepo: jest.Mocked<ITaskRepository>;
    let userRepo: jest.Mocked<IUserRepository>;
    let domainService: TaskDomainService;

    beforeEach(async () => {
        taskRepo = {
            findOne: jest.fn(),
            save: jest.fn(),
            softRemove: jest.fn(),
            findWithFilters: jest.fn(),
        };

        userRepo = {
            findById: jest.fn(),
            findByUsername: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
        };

        domainService = new TaskDomainService(taskRepo);

        jest.spyOn(domainService, 'createNewTask').mockImplementation(jest.fn());
        jest.spyOn(domainService, 'validateTaskOwnership').mockImplementation(jest.fn());
        jest.spyOn(domainService, 'changeStatus').mockImplementation(jest.fn());
        jest.spyOn(domainService, 'softDelete').mockImplementation(jest.fn());

        const module = await Test.createTestingModule({
            providers: [
                TaskService,
                { provide: 'ITaskRepository', useValue: taskRepo },
                { provide: 'IUserRepository', useValue: userRepo },
                { provide: TaskDomainService, useValue: domainService },
            ],
        }).compile();

        service = module.get(TaskService);
    });

    describe('findFilteredTasks', () => {
        it('should call repo with userId included in filters', async () => {
            const task = new Task();
            task.id = 1;
            taskRepo.findWithFilters.mockResolvedValue([task]);

            const result = await service.findFilteredTasks(1, { status: TaskStatus.PENDING }, {});

            expect(taskRepo.findWithFilters).toHaveBeenCalledWith(
                { status: TaskStatus.PENDING, userId: 1 },
                {}
            );
            expect(result.length).toBe(1);
        });
    });

    describe('findAllTasksForAdmin', () => {
        it('should call repo without modifying filters', async () => {
            const task = new Task();
            task.id = 1;
            taskRepo.findWithFilters.mockResolvedValue([task]);

            const result = await service.findAllTasksForAdmin({}, {});
            expect(taskRepo.findWithFilters).toHaveBeenCalledWith({}, {});
            expect(result.length).toBe(1);
        });
    });

    describe('createTask', () => {
        it('should create and save a task', async () => {
            const user = new User();
            user.id = 1;

            const task = new Task();
            task.title = 'test';
            task.user = user;

            userRepo.findById.mockResolvedValue(user);
            jest.spyOn(domainService, 'createNewTask').mockImplementation(() => task);
            taskRepo.save.mockResolvedValue(task);

            const result = await service.createTask('titulo', 'desc', user.id);

            expect(userRepo.findById).toHaveBeenCalledWith(user.id);
            expect(domainService.createNewTask).toHaveBeenCalledWith('titulo', 'desc', user);
            expect(taskRepo.save).toHaveBeenCalledWith(task);
            expect(result).toBeDefined();
        });

        it('should throw if user not found', async () => {
            userRepo.findById.mockResolvedValue(null);

            await expect(service.createTask('titulo', 'desc', 99)).rejects.toThrow('User not found');
        });
    });

    describe('changeTaskStatusById', () => {
        it('should load, validate, change status and save task', async () => {
            const task = new Task();
            task.id = 1;
            task.status = TaskStatus.PENDING;
            task.user = new User();
            task.user.id = 1;

            taskRepo.findOne.mockResolvedValue(task);
            taskRepo.save.mockResolvedValue(task);

            const result = await service.changeTaskStatusById(1, Transitions.START, 1);

            expect(domainService.validateTaskOwnership).toHaveBeenCalledWith(task, 1);
            expect(domainService.changeStatus).toHaveBeenCalledWith(task, Transitions.START);
            expect(taskRepo.save).toHaveBeenCalledWith(task);
            expect(result).toBeDefined();
        });

        it('should throw if task not found', async () => {
            taskRepo.findOne.mockResolvedValue(null);

            await expect(service.changeTaskStatusById(1, Transitions.START, 1)).rejects.toThrow(
                'Task not found'
            );
        });
    });

    describe('deleteTask', () => {
        it('should call softDelete after validation', async () => {
            const task = new Task();
            task.id = 1;
            task.user = new User();
            task.user.id = 1;

            taskRepo.findOne.mockResolvedValue(task);

            await service.deleteTask(task.id, task.user.id);

            expect(domainService.validateTaskOwnership).toHaveBeenCalledWith(task, task.user.id);
            expect(domainService.softDelete).toHaveBeenCalledWith(task);
        });

        it('should throw if task not found', async () => {
            taskRepo.findOne.mockResolvedValue(null);

            await expect(service.deleteTask(1, 1)).rejects.toThrow('Task not found');
        });
    });

    describe('updateTask', () => {
        it('should load, validate, update and save task', async () => {
            const dto: UpdateTaskDTO = { taskId: 1, title: 'new', description: 'desc' };
            const task = new Task();
            task.id = 1;
            task.user = new User();
            task.user.id = 1;

            taskRepo.findOne.mockResolvedValue(task);
            taskRepo.save.mockResolvedValue(task);

            const spy = jest.spyOn(TaskMapper, 'updateEntityFromDto');

            const result = await service.updateTask(dto, 1);

            expect(domainService.validateTaskOwnership).toHaveBeenCalledWith(task, 1);
            expect(spy).toHaveBeenCalledWith(task, dto);
            expect(taskRepo.save).toHaveBeenCalledWith(task);
            expect(result).toBeDefined();
        });

        it('should throw if task not found', async () => {
            const dto: UpdateTaskDTO = { taskId: 1, title: 'x', description: 'y' };
            taskRepo.findOne.mockResolvedValue(null);

            await expect(service.updateTask(dto, 1)).rejects.toThrow('Task not found');
        });
    });
});
