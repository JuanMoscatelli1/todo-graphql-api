import { TaskStatus } from "./task-status.enum";
import { Transitions } from "./task-transitions.enum";
import { TaskDomainService } from "./task.domain.service";
import { Task } from "./task.entity";
import { ITaskRepository } from "./task.repository.interface";
import { User } from "../../user/domain/user.entity";


describe('TaskDomainService', () => {
    let service: TaskDomainService;
    let mockRepo: jest.Mocked<ITaskRepository>;

    beforeEach(() => {
        mockRepo = {
            findOne: jest.fn(),
            softRemove: jest.fn(),
            findWithFilters: jest.fn(),
            save: jest.fn(),
        } as jest.Mocked<ITaskRepository>;

        service = new TaskDomainService(mockRepo);
    });

    describe('findAndValidateTask', () => {
        it('should return the task if it exists and belongs to user', async () => {
            const user = { id: 1 } as User;
            const task = { id: 123, user } as Task;

            mockRepo.findOne.mockResolvedValue(task);

            const result = await service.findAndValidateTask(123, 1);
            expect(result).toBe(task);
        });

        it('should throw if task does not exist', async () => {
            mockRepo.findOne.mockResolvedValue(null);

            await expect(service.findAndValidateTask(123, 1)).rejects.toThrow('Task not found');
        });

        it('should throw if task belongs to another user', async () => {
            const task = { id: 123, user: { id: 2 } } as Task;
            mockRepo.findOne.mockResolvedValue(task);

            await expect(service.findAndValidateTask(123, 1)).rejects.toThrow('No autorizado');
        });
    });

    describe('createNewTask', () => {
        it('should create a task with default values', () => {
            const user = { id: 1, username: 'test' } as User;
            const task = service.createNewTask('titulo', 'desc', user);

            expect(task.title).toBe('titulo');
            expect(task.description).toBe('desc');
            expect(task.status).toBe(TaskStatus.PENDING);
            expect(task.user).toBe(user);
            expect(task.createdAt).toBeInstanceOf(Date);
        });
    });

    describe('changeStatus', () => {
        it('should change PENDING -> IN_PROGRESS with START', () => {
            const task = { status: TaskStatus.PENDING } as Task;
            service.changeStatus(task, Transitions.START);
            expect(task.status).toBe(TaskStatus.IN_PROGRESS);
        });

        it('should change IN_PROGRESS -> COMPLETED with COMPLETE', () => {
            const task = { status: TaskStatus.IN_PROGRESS } as Task;
            service.changeStatus(task, Transitions.COMPLETE);
            expect(task.status).toBe(TaskStatus.COMPLETED);
        });

        it('should change IN_PROGRESS -> PENDING with RESET', () => {
            const task = { status: TaskStatus.IN_PROGRESS } as Task;
            service.changeStatus(task, Transitions.RESET);
            expect(task.status).toBe(TaskStatus.PENDING);
        });

        it('should throw if invalid transition', () => {
            const task = { status: TaskStatus.COMPLETED } as Task;
            expect(() => service.changeStatus(task, Transitions.START)).toThrow();
        });
    });

    describe('softDelete', () => {
        it('should call softRemove from repository', async () => {
            const task = { id: 1 } as Task;

            await service.softDelete(task);

            expect(mockRepo.softRemove).toHaveBeenCalledWith(task);
        });
    });
});
