import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './permission.enum';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column("simple-array")
    permissions: Permission[];
}
