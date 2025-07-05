import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskDTO {
  @Field()
  title: string;

  @Field()
  description: string;
}
