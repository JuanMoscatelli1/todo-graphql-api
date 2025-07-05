import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "./domain/permission.entity";
import { PermissionRepository } from "./infra/permission.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Permission])],
    providers: [{
        provide: 'IPermissionRepository',
        useClass: PermissionRepository,
    },],
    exports: ['IPermissionRepository'],
})
export class PermissionModule { }
