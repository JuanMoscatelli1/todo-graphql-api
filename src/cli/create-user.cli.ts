import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/application/user.service';
import { Permission } from '../user/domain/permission.enum';


@Injectable()
@Command({ name: 'create-user', description: 'Crear un usuario desde CLI' })
export class CreateUserCommand extends CommandRunner {
  constructor(private readonly userService: UserService) {
    super();
  }

  async run(params: string[]): Promise<void> {
    const [username, password, ...permStrings] = params;

    if (!username || !password) {
      console.error('Faltan argumentos. Uso: create-user username password permisos');
      return;
    }

    const permissions = permStrings
      .map(p => Permission[p as keyof typeof Permission])
      .filter(Boolean);

    if (permissions.length === 0) {
      console.warn('No se pasaron permisos válidos, se asignara permiso user por defecto');
      permissions.push(Permission.USER);
    }

    await this.userService.create({ username, password, permissions });
    console.log(`Usuario "${username}" creado con permisos: ${permissions.join(', ')}`);
  }

}
