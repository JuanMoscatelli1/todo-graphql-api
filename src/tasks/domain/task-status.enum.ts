import { registerEnumType } from "@nestjs/graphql";

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Estados posibles de una tarea: PENDING, IN_PROGRESS, COMPLETED, CANCELLED',
});