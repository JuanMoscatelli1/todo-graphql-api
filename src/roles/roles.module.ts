import { Module } from '@nestjs/common';
import { RolesGuard } from './infra/roles.guard';

@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class RolesModule {}
