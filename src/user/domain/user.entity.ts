import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, OneToMany } from 'typeorm';
import { Role } from '../../roles/domain/roles.enum';
import { Task } from '../../tasks/domain/task.entity';



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({
        type: 'simple-enum',
        enum: Role,
        array: true
    })
    roles: Role[];

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Task, (task) => task.user, { cascade: true })
    tasks: Task[];
}
