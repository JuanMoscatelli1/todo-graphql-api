import { Inject, Injectable } from "@nestjs/common";
import { UserDomainService } from "../domain/user.domain.service";
import { IUserRepository } from "../domain/user.repository.interface";
import { User } from "../domain/user.entity";
import { CreateUserDTO } from "./user.create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
  ) { }

  async create(createUserDto: CreateUserDTO): Promise<string> {
    const { username, password, permissions } = createUserDto;
    const user = await this.userDomainService.register(username, password);
    user.permissions = permissions;
    await this.userRepository.save(user);
    return 'User created';
  }


  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
