import { TaskFilterInput } from '../presentation/task-filter.input';
import { TaskOrderInput } from '../presentation/task-order.input';
import { Task } from './task.entity';

export interface ITaskRepository {
  softRemove(task: Task): Promise<Task>;
  save(task: Task): Promise<Task>;
  findOne(id: number): Promise<Task | null>;
  findWithFilters(
    filters: Partial<TaskFilterInput>,
    order: Partial<TaskOrderInput>,
  ): Promise<Task[]>;

}
