import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { TaskStatus } from '../domain/task-status.enum';

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

@ObjectType()
export class TaskDTO {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field()
  createdAt: Date;
}
