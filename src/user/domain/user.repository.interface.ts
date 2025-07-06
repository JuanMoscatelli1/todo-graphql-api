import { User } from './user.entity';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
}
