import { TaskFilterInput } from '../presentation/task-filter.input';
import { TaskOrderInput } from '../presentation/task-order.input';
import { Task } from './task.entity';

export interface ITaskRepository {
  save(task: Task): Promise<Task>;
  findAll(): Promise<Task[]>;
  findByUser(userId: number): Promise<Task[]>;
  findOne(id: number): Promise<Task | null>;
  delete(id: number): Promise<void>;
  findWithFilters(
    filters: Partial<TaskFilterInput>,
    order: Partial<TaskOrderInput>,
  ): Promise<Task[]>;

}
