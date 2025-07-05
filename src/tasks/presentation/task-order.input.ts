import { InputType, Field, registerEnumType } from '@nestjs/graphql';

export enum OrderDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

registerEnumType(OrderDirection, {
    name: 'OrderDirection',
});

@InputType()
export class TaskOrderInput {
    @Field(() => OrderDirection, { nullable: true })
    title?: OrderDirection;

    @Field(() => OrderDirection, { nullable: true })
    createdAt?: OrderDirection;

    @Field(() => OrderDirection, { nullable: true })
    status?: OrderDirection;
}