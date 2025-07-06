import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTaskDTO {
  @Field(() => ID)
  taskId: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
}