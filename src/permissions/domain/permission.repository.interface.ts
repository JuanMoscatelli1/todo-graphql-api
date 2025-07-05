import { Permission } from "./permission.entity";

export interface IPermissionRepository{
    findByNames(names: string[]): Promise<Permission[]>;
}