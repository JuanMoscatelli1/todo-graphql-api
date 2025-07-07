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
        };

        service = new TaskDomainService(mockRepo);
    });

    describe('validateTaskOwnership', () => {
        it('should not throw if task belongs to user', () => {
            const user = new User();
            user.id = 1;

            const task = new Task();
            task.user = user;

            expect(() => service.validateTaskOwnership(task, 1)).not.toThrow();
        });

        it('should throw if task belongs to different user', () => {
            const user = new User();
            user.id = 2;

            const task = new Task();
            task.user = user;

            expect(() => service.validateTaskOwnership(task, 1)).toThrow('No autorizado');
        });
    });

    describe('createNewTask', () => {
        const user = new User();
        user.id = 1;

        it('should create a task with valid title and description', () => {
            const task = service.createNewTask('Tarea valida', 'Descripcion valida', user);

            expect(task.title).toBe('Tarea valida');
            expect(task.description).toBe('Descripcion valida');
            expect(task.user).toBe(user);
            expect(task.status).toBe(TaskStatus.PENDING);
        });

        it('should throw if title is empty', () => {
            expect(() => {
                service.createNewTask('', 'Descripcion valida', user);
            }).toThrow('El titulo es obligatorio');
        });

        it('should throw if title is only spaces', () => {
            expect(() => {
                service.createNewTask('   ', 'Descripcion valida', user);
            }).toThrow('El titulo es obligatorio');
        });

        it('should throw if description is empty', () => {
            expect(() => {
                service.createNewTask('Titulo valido', '', user);
            }).toThrow('La descripcion es obligatoria');
        });

        it('should throw if description is only spaces', () => {
            expect(() => {
                service.createNewTask('Titulo valido', '   ', user);
            }).toThrow('La descripcion es obligatoria');
        });
    });

    describe('changeStatus', () => {
        it('should change PENDING -> IN_PROGRESS with START', () => {
            const task = new Task();
            task.status = TaskStatus.PENDING;

            service.changeStatus(task, Transitions.START);

            expect(task.status).toBe(TaskStatus.IN_PROGRESS);
        });

        it('should change IN_PROGRESS -> COMPLETED with COMPLETE', () => {
            const task = new Task();
            task.status = TaskStatus.IN_PROGRESS;

            service.changeStatus(task, Transitions.COMPLETE);

            expect(task.status).toBe(TaskStatus.COMPLETED);
        });

        it('should change IN_PROGRESS -> PENDING with RESET', () => {
            const task = new Task();
            task.status = TaskStatus.IN_PROGRESS;

            service.changeStatus(task, Transitions.RESET);

            expect(task.status).toBe(TaskStatus.PENDING);
        });

        it('should throw if invalid transition', () => {
            const task = new Task();
            task.status = TaskStatus.COMPLETED;

            expect(() => service.changeStatus(task, Transitions.START)).toThrow();
        });
    });

    describe('softDelete', () => {
        it('should call softRemove from repository', async () => {
            const task = new Task();
            task.id = 1;

            await service.softDelete(task);

            expect(mockRepo.softRemove).toHaveBeenCalledWith(task);
        });
    });
});
