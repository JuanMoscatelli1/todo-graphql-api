import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permission } from "../domain/permission.entity";

@Injectable()
export class PermissionRepository {
    constructor(
        @InjectRepository(Permission)
        private readonly repo: Repository<Permission>,
    ) { }

    async findByNames(names: string[]): Promise<Permission[]> {
        return this.repo.find({
            where: names.map(name => ({ name })),
        });
    }
}
