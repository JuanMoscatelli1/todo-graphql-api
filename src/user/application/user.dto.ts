import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PermissionDTO } from 'src/permissions/application/permission.dto';

@ObjectType()
export class UserDTO {
    @Field(() => Int)
    id: number;

    @Field()
    username: string;

    @Field(() => [PermissionDTO])
    permissions: PermissionDTO[];
}
