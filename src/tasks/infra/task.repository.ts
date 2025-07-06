import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Task } from '../domain/task.entity';
import { ITaskRepository } from '../domain/task.repository.interface';
import { applyDynamicFilters, applyDynamicOrder } from '../../shared/query-utils';

@Injectable()
export class TaskRepository implements ITaskRepository {
    constructor(
        @InjectRepository(Task)
        private readonly repo: Repository<Task>,
    ) { }


    save(task: Task): Promise<Task> {
        return this.repo.save(task);
    }

    findOne(id: number): Promise<Task | null> {
        return this.repo.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['user'],
        });
    }
    async softRemove(task: Task): Promise<Task> {
        return this.repo.softRemove(task);
    }

    async findWithFilters(
        filters: Record<string, any> = {},
        order: Record<string, 'ASC' | 'DESC'> = {}
    ): Promise<Task[]> {
        const query = this.repo.createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('task.deletedAt IS NULL');

        applyDynamicFilters(query, 'task', filters);
        applyDynamicOrder(query, 'task', order);
        
        return await query.getMany();
    }
}
