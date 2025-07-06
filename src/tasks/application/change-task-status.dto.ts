import { InputType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { Transitions } from '../domain/task-transitions.enum';


registerEnumType(Transitions, {
  name: 'Transitions',
});

@InputType()
export class ChangeTaskStatusDTO {
  @Field(() => ID)
  taskId: number;

  @Field(() => Transitions)
  action: Transitions;
}
