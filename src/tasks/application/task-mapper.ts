import { Task } from "../domain/task.entity";
import { UpdateTaskDTO } from "./update-task.dto";

export class TaskMapper {
  static updateEntityFromDto(task: Task, dto: UpdateTaskDTO): Task {
    //usar null si quiero q no se pueda limpiar
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    return task;
  }
}
