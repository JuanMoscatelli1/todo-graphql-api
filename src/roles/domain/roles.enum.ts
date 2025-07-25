import { registerEnumType } from "@nestjs/graphql";

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

registerEnumType(Role, {
  name: 'Role', // nombre para GraphQL
  description: 'User roles',
});
