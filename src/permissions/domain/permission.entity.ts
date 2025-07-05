import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../../user/domain/user.entity';

@ObjectType()
@Entity()
export class Permission {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.permissions)
  users: User[];
}
