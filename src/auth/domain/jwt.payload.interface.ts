import { Role } from '../../roles/domain/roles.enum';

export interface JwtPayload {
  sub: number;
  username: string;
  roles: Role[];
}