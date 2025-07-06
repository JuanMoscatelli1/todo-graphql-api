import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserPublicDTO {
    @Field(() => Int)
    id: number;

    @Field()
    username: string;
}
