import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ChangeTaskStatusDTO } from '../application/change-task-status.dto';
import { CreateTaskDTO } from '../application/create-task.dto';
import { TaskDTO } from '../application/task.dto';
import { TaskService } from '../application/task.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/infra/gql-auth.guard';
import { Role } from 'src/roles/domain/roles.enum';
import { Roles } from 'src/roles/infra/roles.decorator';
import { RolesGuard } from 'src/roles/infra/roles.guard';
import { GqlContext } from 'src/auth/domain/graphql-context.interface';
import { UpdateTaskDTO } from '../application/update-task.dto';
import { TaskFilterInput } from './task-filter.input';
import { TaskOrderInput } from './task-order.input';

@Resolver(() => TaskDTO)
export class TaskResolver {
    constructor(private readonly taskService: TaskService) { }

    @Query(() => [TaskDTO])
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async tasks(): Promise<TaskDTO[]> {
        return this.taskService.findAll();
    }

    @Query(() => [TaskDTO])
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async tasksByUser(
        @Args('filter', { nullable: true }) filter: TaskFilterInput,
        @Args('order', { nullable: true }) order: TaskOrderInput,
        @Context() context: GqlContext
    ): Promise<TaskDTO[]> {
        const userId = context.req.user.userId;
        return this.taskService.findFilteredTasks(userId, filter, order)
    }


    @Query(() => [TaskDTO])
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async tasksForAdmin(
        @Args('filter', { nullable: true }) filter: TaskFilterInput,
        @Args('order', { nullable: true }) order: TaskOrderInput
    ): Promise<TaskDTO[]> {
        return this.taskService.findAllTasksForAdmin(filter, order);
    }

    @Mutation(() => TaskDTO)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async createTask(@Args('input') input: CreateTaskDTO, @Context() context: GqlContext): Promise<TaskDTO> {
        const userId = context.req.user.userId;
        return await this.taskService.createTask(input.title, input.description, userId);

    }

    @Mutation(() => TaskDTO)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async changeTaskStatus(
        @Args('input') input: ChangeTaskStatusDTO,
        @Context() context: GqlContext
    ): Promise<TaskDTO> {
        const userId = context.req.user.userId;
        return this.taskService.changeTaskStatusById(input.taskId, input.action, userId);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async deleteTask(@Args('taskId') taskId: number, @Context() context: GqlContext): Promise<boolean> {
        const userId = context.req.user.userId;
        await this.taskService.deleteTask(taskId, userId);
        return true;
    }

    @Mutation(() => TaskDTO)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async updateTask(
        @Args('input') input: UpdateTaskDTO,
        @Context() context: GqlContext,
    ): Promise<TaskDTO> {
        const userId = context.req.user.userId;
        return this.taskService.updateTask(input, userId);
    }
}
