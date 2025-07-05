import { InputType, Field } from '@nestjs/graphql';
import { Permission } from '../../permissions/domain/permission.enum';

@InputType({ description: 'Datos necesarios para registrar un usuario' })
export class CreateUserDTO {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field(() => [Permission])
  permissions: Permission[];
}
