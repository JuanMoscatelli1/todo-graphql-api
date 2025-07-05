import { JwtPayload } from './jwt.payload.interface';

export interface GqlContext {
    req: {
        user: JwtPayload & { userId: number };
    };
}
