import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schemas/permission.schema';
import { Model, Types } from 'mongoose';
import { PermissionInterface } from './interfaces/permission.interface';

@Injectable()
export class PermissionService {

    constructor(@InjectModel(Permission.name) private permissionData: Model<Permission>) { }

    async create(permissionDto: PermissionDto): Promise<PermissionInterface> {

        const { name } = permissionDto;

        const existingPermission = await this.permissionData.findOne({
            name: name.toLowerCase()
        });

        if (existingPermission) {
            throw new BadRequestException('Permission already created for this action');
        }

        const newPermission = new this.permissionData({
            ...permissionDto,
            name: name.toLowerCase()
        });

        const savePermission = await newPermission.save();
        const returnPermission = savePermission.toObject();

        return {
            ...returnPermission,
            _id: returnPermission._id.toString()
        }

    }

    async update(updatepermissionDto: UpdatePermissionDto): Promise<PermissionInterface> {

        const { id, ...updateData } = updatepermissionDto;

        const updatePermission = await this.permissionData.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatePermission) {
            throw new BadRequestException(`Permission does not exist with given id ${id}`);
        }

        const returnPermission = updatePermission.toObject();

        return {
            ...returnPermission,
            _id: returnPermission._id.toString()
        }

    }

    async delete(id: Types.ObjectId): Promise<PermissionInterface> {

        const deletePermission = await this.permissionData.findByIdAndDelete(id);
        if (!deletePermission) {
            throw new NotFoundException(`Permission with id ${id} not found`);
        }
        const returnPermission = deletePermission.toObject();

        return {
            ...returnPermission,
            _id: returnPermission._id.toString()
        }
    }

    async deleteAll() {

        const result = await this.permissionData.deleteMany({});

        return {
            deletedCount: result.deletedCount,
        }
    }
}
