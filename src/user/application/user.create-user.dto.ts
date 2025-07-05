import { InputType, Field } from '@nestjs/graphql';
import { Role } from '../../roles/domain/roles.enum';


@InputType({ description: 'Datos necesarios para registrar un usuario' })
export class CreateUserDTO {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field(() => [Role])
  roles: Role[]; 
}
