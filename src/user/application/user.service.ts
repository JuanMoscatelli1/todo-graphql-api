import { Inject, Injectable } from "@nestjs/common";
import { UserDomainService } from "../domain/user.domain.service";
import { IUserRepository } from "../domain/user.repository.interface";
import { User } from "../domain/user.entity";
import { CreateUserDTO } from "./user.create-user.dto";

import { UserDTO } from "./user.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
  ) { }

  async create(createUserDto: CreateUserDTO): Promise<string> {
    const { username, password, roles } = createUserDto;
    const user = await this.userDomainService.register(username, password);
    user.roles = roles;
    await this.userRepository.save(user);
    return 'User created';
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);  
  }

  async findAll(): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll();

    return users.map(user => ({
      id: user.id,
      username: user.username,
      roles: user.roles,
    }));
  }
}
