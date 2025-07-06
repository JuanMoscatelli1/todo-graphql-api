import { IUserRepository } from '../domain/user.repository.interface';
import { User } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) { }

    async findByUsername(username: string): Promise<User | null> {
        return this.repo.findOne({ where: { username } });
    }

    async save(user: User): Promise<User> {
        return this.repo.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.repo.find();
    }

    async findById(id: number): Promise<User | null> {
        return this.repo.findOne({ where: { id }});
    }
}
