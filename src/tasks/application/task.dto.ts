import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { TaskStatus } from '../domain/task-status.enum';

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

@ObjectType()
export class TaskDTO {
  @Field({ description: 'Id unico de la tarea' })
  id: number;

  @Field({ description: 'Tíiulo de la tarea' })
  title: string;

  @Field({ description: 'Descripcion' })
  description: string;

  @Field({ description: 'Estado actual de la tarea' })
  status: TaskStatus;

  @Field({ description: 'Fecha de creacion' })
  createdAt: Date;
}
