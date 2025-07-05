import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTaskDTO {
  @Field(() => Int)
  taskId: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
}