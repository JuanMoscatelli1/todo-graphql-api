import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../../roles/domain/roles.enum';


@ObjectType()
export class UserDTO {
    @Field(() => ID)
    id: number;

    @Field()
    username: string;

    @Field(() => [Role])
    roles: Role[];
}
