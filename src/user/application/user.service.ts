import { Inject, Injectable } from "@nestjs/common";
import { UserDomainService } from "../domain/user.domain.service";
import { IUserRepository } from "../domain/user.repository.interface";
import { User } from "../domain/user.entity";
import { CreateUserDTO } from "./user.create-user.dto";
import { IPermissionRepository } from "src/permissions/domain/permission.repository.interface";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
    private readonly userDomainService: UserDomainService,
  ) { }

  async create(createUserDto: CreateUserDTO): Promise<string> {
    const { username, password, permissions } = createUserDto;
    const user = await this.userDomainService.register(username, password);
    const permissionEntities = await this.permissionRepository.findByNames(permissions);
    user.permissions = permissionEntities
    await this.userRepository.save(user);
    return 'User created';
  }


  async findAll(): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll();

    return users.map(user => ({
      id: user.id,
      username: user.username,
      permissions: user.permissions, 
    }));
  }
}
