import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from '../../permissions/domain/permission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToMany(() => Permission, (permission) => permission.users, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  permissions: Permission[];
}
