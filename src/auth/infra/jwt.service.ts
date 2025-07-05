import { IJwtService } from '../domain/jwt.service.interface';
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayload } from '../domain/jwt.payload.interface';

@Injectable()
export class JwtService implements IJwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  sign(payload: JwtPayload): string {
    return this.nestJwtService.sign(payload);
  }

  verify(token: string): JwtPayload {
    return this.nestJwtService.verify(token);
  }
}
