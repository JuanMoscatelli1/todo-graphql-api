import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChangeTaskStatusDTO } from '../application/change-task-status.dto';
import { CreateTaskDTO } from '../application/create-task.dto';
import { TaskDTO } from '../application/task.dto';
import { TaskService } from '../application/task.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/infra/gql-auth.guard';
import { Role } from 'src/roles/domain/roles.enum';
import { Roles } from 'src/roles/infra/roles.decorator';
import { RolesGuard } from 'src/roles/infra/roles.guard';

@Resolver(() => TaskDTO)
export class TaskResolver {
    constructor(private readonly taskService: TaskService) { }

    @Query(() => [TaskDTO])
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async tasks(): Promise<TaskDTO[]> {
        return this.taskService.findAll();
    }

    @Mutation(() => TaskDTO)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async createTask(@Args('input') input: CreateTaskDTO): Promise<TaskDTO> {
        return this.taskService.createTask(input.title, input.description);
    }

    @Mutation(() => TaskDTO)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async changeTaskStatus(
        @Args('input') input: ChangeTaskStatusDTO,
    ): Promise<TaskDTO> {
        return this.taskService.changeTaskStatusById(input.taskId, input.action);
    }
}
