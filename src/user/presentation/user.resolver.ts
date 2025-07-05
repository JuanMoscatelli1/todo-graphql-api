import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from '../application/user.service';
import { UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../../permissions/infra/permissions.guard';
import { Permission } from '../../permissions/domain/permission.enum';
import { CreateUserDTO } from '../application/user.create-user.dto';
import { UserDTO } from '../application/user.dto';
import { GqlAuthGuard } from 'src/auth/infra/gql-auth.guard';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(() => [UserDTO], { name: 'users' })
    @UseGuards(GqlAuthGuard, new PermissionsGuard([Permission.ADMIN]))
    async findAll(): Promise<UserDTO[]> {
        return this.userService.findAll();
    }

    @UseGuards(GqlAuthGuard, new PermissionsGuard([Permission.ADMIN]))
    @Mutation(() => String, { description: 'Registra un nuevo usuario con permisos' })
    async register(
        @Args('input') input: CreateUserDTO,
    ): Promise<string> {
        return this.userService.create(input);
    }
}
