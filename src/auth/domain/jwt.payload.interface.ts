import { Permission } from "src/permissions/domain/permission.enum";

export interface JwtPayload {
  sub: number;
  username: string;
  permissions: string[];
}