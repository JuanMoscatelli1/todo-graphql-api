import { JwtPayload } from "./jwt.payload.interface";

export interface IJwtService {
  sign(payload: JwtPayload): string;
  verify(token: string): JwtPayload;
}
