import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { Transitions } from '../domain/task-transitions.enum';


registerEnumType(Transitions, {
  name: 'Transitions',
});

@InputType()
export class ChangeTaskStatusDTO {
  @Field()
  taskId: number;

  @Field(() => Transitions)
  action: Transitions;
}
