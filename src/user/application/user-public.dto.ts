import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserPublicDTO {
    @Field(() => ID)
    id: number;

    @Field()
    username: string;
}
