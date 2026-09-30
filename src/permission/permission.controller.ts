import { BadRequestException, Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { PermissionService } from './permission.service';
import { Types } from 'mongoose';
import { RequirePermissions } from './permission.decorator';

@ApiTags('Permission')
@Controller({
    path: 'permission',
    version: '1'
})
export class PermissionController {

    constructor(private readonly permissionService:PermissionService){}

    @Post('/create')
    @ApiOperation({ summary: 'Create permission' })
    @ApiBody({type: PermissionDto})
    createPermission(@Body() permissionDto:PermissionDto){
        return this.permissionService.create(permissionDto);
    }

    @Put('/update')
    @RequirePermissions('permission.update')
    @ApiOperation({ summary: 'Update permission' })
    @ApiBody({type: UpdatePermissionDto})
    @ApiBearerAuth('access-token')
    updatePermission(@Body() updatepermissionDto:UpdatePermissionDto){
        return this.permissionService.update(updatepermissionDto);
    }

   
    @Delete('/delete/:id')
    @RequirePermissions('permission.delete')
    @ApiOperation({ summary: 'Delete permission' })
    @ApiBearerAuth('access-token')
    deletePermission(@Param('id') id:string){

        if(! Types.ObjectId.isValid(id)){
            throw new BadRequestException('Invalid Permission Id');
        }

        const objectId = new Types.ObjectId(id);

        return this.permissionService.delete(objectId);
    }

    @Delete('/deleteAll')
    @RequirePermissions('permission.deleteAll')
    @ApiOperation({ summary: 'Delete All permission' })
    @ApiBearerAuth('access-token')
    deleteAllPermission(){

        return this.permissionService.deleteAll();
    }

}
