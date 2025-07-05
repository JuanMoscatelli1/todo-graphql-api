import { InputType, Field } from '@nestjs/graphql';
import { TaskStatus } from '../domain/task-status.enum';

@InputType()
export class TaskFilterInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @Field({ nullable: true })
  userId?: number;
}
