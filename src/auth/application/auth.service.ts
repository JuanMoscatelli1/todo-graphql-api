import { Inject, Injectable } from '@nestjs/common';
import { AuthDomainService } from '../domain/auth.domain.service';
import { IJwtService } from '../domain/jwt.service.interface';
import { JwtPayload } from '../domain/jwt.payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly authDomainService: AuthDomainService,
        @Inject('IJwtService')
        private readonly jwtService: IJwtService,
    ) { }

    async login(username: string, password: string): Promise<{ accessToken: string }> {
        const user = await this.authDomainService.validateUser(username, password);

        const payload: JwtPayload = {
            username: user.username,
            sub: user.id,
            roles: user.roles, 
        };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }
}

