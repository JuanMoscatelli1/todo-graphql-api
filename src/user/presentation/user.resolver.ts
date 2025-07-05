import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from '../application/user.service';
import { UseGuards } from '@nestjs/common';
import { CreateUserDTO } from '../application/user.create-user.dto';
import { UserDTO } from '../application/user.dto';
import { GqlAuthGuard } from '../../auth/infra/gql-auth.guard';
import { RolesGuard } from '../../roles/infra/roles.guard';
import { Role } from '../../roles/domain/roles.enum';
import { Roles } from '../../roles/infra/roles.decorator';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(() => [UserDTO], { name: 'users' })
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async findAll(): Promise<UserDTO[]> {
        return this.userService.findAll();
    }

    @Mutation(() => String, { description: 'Registra un nuevo usuario con permisos' })
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async register(
        @Args('input') input: CreateUserDTO,
    ): Promise<string> {
        return this.userService.create(input);
    }
}
