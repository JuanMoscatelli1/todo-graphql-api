import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { TaskStatus } from '../domain/task-status.enum';
import { UserPublicDTO } from '../../user/application/user-public.dto';

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

@ObjectType()
export class TaskDTO {
  @Field(() => ID, { description: 'Id unico de la tarea' })
  id: number;

  @Field({ description: 'Tíiulo de la tarea' })
  title: string;

  @Field({ description: 'Descripcion' })
  description: string;

  @Field({ description: 'Estado actual de la tarea' })
  status: TaskStatus;

  @Field({ description: 'Fecha de creacion' })
  createdAt: Date;

  @Field(() => UserPublicDTO, { description: 'Usuario creador de la tarea' })
  user: UserPublicDTO;
}
