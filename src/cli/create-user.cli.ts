import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/application/user.service';
import { Role } from '../roles/domain/roles.enum';

@Injectable()
@Command({ name: 'create-user', description: 'Crear un usuario desde CLI' })
export class CreateUserCommand extends CommandRunner {
  constructor(private readonly userService: UserService) {
    super();
  }

  async run(params: string[]): Promise<void> {
    const [username, password, ...roleStrings] = params;

    if (!username || !password) {
      console.error('Faltan argumentos. Uso: create-user username password roles');
      return;
    }

    const roles = roleStrings
      .map(r => Role[r.toUpperCase() as keyof typeof Role]) 
      .filter(Boolean);

    if (roles.length === 0) {
      console.warn('No se pasaron roles validos, se asigna el rol User por defecto');
      roles.push(Role.USER);
    }

    await this.userService.create({ username, password, roles });
    console.log(`Usuario "${username}" creado con roles: ${roles.join(', ')}`);
  }
}
