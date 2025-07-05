import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Permission } from '../domain/permission.enum';

@ObjectType()
export class UserDTO {
    @Field(() => Int)
    id: number;

    @Field()
    username: string;

    @Field(() => [Permission])
    permissions: Permission[];
}
