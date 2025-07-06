import { UserPublicDTO } from "../../user/application/user-public.dto";
import { User } from "../../user/domain/user.entity";
import { Task } from "../domain/task.entity";
import { TaskDTO } from "./task.dto";
import { UpdateTaskDTO } from "./update-task.dto";

export class TaskMapper {
  static updateEntityFromDto(task: Task, dto: UpdateTaskDTO): Task {
    //usar null si quiero q no se pueda limpiar
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    return task;
  }

  static userToPublicDTO(user: User): UserPublicDTO {
    return {
      id: user.id,
      username: user.username
    };
  }

  static toDTO(task: Task): TaskDTO {
    const dto = new TaskDTO();
    dto.id = task.id;
    dto.title = task.title;
    dto.description = task.description;
    dto.status = task.status;
    dto.createdAt = task.createdAt;

    if (task.user) {
      dto.user = this.userToPublicDTO(task.user);
    }

    return dto;
  }
}
