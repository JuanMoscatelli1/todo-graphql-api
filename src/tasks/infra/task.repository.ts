import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../domain/task.entity';
import { ITaskRepository } from '../domain/task.repository.interface';

@Injectable()
export class TaskRepository implements ITaskRepository {
    constructor(
        @InjectRepository(Task)
        private readonly repo: Repository<Task>,
    ) { }

    findAll(): Promise<Task[]> {
        return this.repo.find();
    }

    save(task: Task): Promise<Task> {
        return this.repo.save(task);
    }

    findByUser(userId: number): Promise<Task[]> {
        return this.repo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
    }

    findOne(id: number): Promise<Task | null> {
        return this.repo.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}
