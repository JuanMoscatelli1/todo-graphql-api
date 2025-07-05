import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from '../../roles/domain/roles.enum';


@ObjectType()
export class UserDTO {
    @Field(() => Int)
    id: number;

    @Field()
    username: string;

    @Field(() => [Role])
    roles: Role[];
}
