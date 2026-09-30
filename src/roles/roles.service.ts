import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RolesDto, UpdateRolesDto } from './dto/roles.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Roles } from './schemas/roles.schema';
import { Model, Types } from 'mongoose';
import { Permission } from 'src/permission/schemas/permission.schema';
import { RolesInterface } from './interfaces/roles.interface';

@Injectable()
export class RolesService {

    constructor(
        @InjectModel(Roles.name) private rolesData: Model<Roles>,
        @InjectModel(Permission.name) private readonly permissionData: Model<Permission>
    ) { }

    async createRole(rolesDto: RolesDto):Promise<RolesInterface> {

        const { name, permission } = rolesDto;

        const existingRole = await this.rolesData.findOne({
            name: name.toLowerCase()
        });

        if (existingRole) {
            throw new NotFoundException('Role already added');
        }

        const matchPermission = await this.permissionData.find({
            name: { $in: permission }
        });

        if (matchPermission.length != permission.length) {
            throw new BadRequestException('One or more permission are invalid');
        }

        const newRole = new this.rolesData({
            name: name.toLowerCase(),
            permissions: matchPermission.map(p => p._id)
        });

        const saveRole = await newRole.save();

        const roleObject = saveRole.toObject();

        const returnPermission = matchPermission.map(p => p.name)

        return {
            ...roleObject,
            _id: saveRole._id.toString(),
            permissions: returnPermission
        };

    }

    async updateRole(updateRolesDto: UpdateRolesDto):Promise<RolesInterface> {

        const { id, ...updateData } = updateRolesDto;

        const updateRole = await this.rolesData.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('permissions');

        if (!updateRole) {
            throw new NotFoundException(`Role with id ${id} not found`);
        }

        const returnRole = updateRole.toObject();

        const returnPermission = returnRole.permissions.map(p => p.name);

        return {
            ...returnRole,
            _id: returnRole._id.toString(),
            permissions:returnPermission
        }

    }

    async deleteRole(id: Types.ObjectId):Promise<RolesInterface> {

        const deleteRole = await this.rolesData.findByIdAndDelete(id).populate('permissions');

        if (!deleteRole) {
            throw new NotFoundException(`Role with id ${id} not found`);
        }

        const returnRole = deleteRole.toObject();

        const returnPermission = deleteRole.permissions.map(p => p.name);

        return {
            ...returnRole,
            _id: returnRole._id.toString(),
            permissions: returnPermission
        }

    }

    async deleteAllRole() {
        const deleteAll = await this.rolesData.deleteMany({});
        if (!deleteAll) {
            throw new NotFoundException(`Roles not found`);
        }

        return {
            deletedCount: deleteAll.deletedCount,
        };
    }

}
