import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Permission } from '../../user/domain/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private requiredPermissions: Permission[]) { }

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (!user) return false;

    return this.requiredPermissions.every(p => user.permissions.includes(p));
  }
}
