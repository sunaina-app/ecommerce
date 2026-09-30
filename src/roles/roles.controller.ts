import { BadRequestException, Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesDto, UpdateRolesDto } from './dto/roles.dto';
import { Types } from 'mongoose';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')

@Controller({
    path: 'roles',
    version: '1'
})
export class RolesController {

    constructor(private readonly roleService: RolesService) { }

    @Post('/add')
    @ApiOperation({summary: 'Create Role'})
    @ApiBody({type: RolesDto})
    createRoles(@Body() rolesDto: RolesDto) {
        return this.roleService.createRole(rolesDto);
    }

    @Put('/update')
    @ApiOperation({summary: 'Update Role'})
    @ApiBody({type: UpdateRolesDto})
    @ApiBearerAuth('access-token')
    updateRoles(@Body() updateRolesDto: UpdateRolesDto) {
        return this.roleService.updateRole(updateRolesDto);
    }

    @Delete('/delete/:id')
    @ApiOperation({summary: 'Delete Role'})
    @ApiBearerAuth('access-token')
    deleteRoles(@Param('id') id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid Role ID');
        }
        const objectId = new Types.ObjectId(id);
        return this.roleService.deleteRole(objectId);
    }

    @Delete('/deleteAll')
    @ApiOperation({summary: 'Delete All Role'})
    @ApiBearerAuth('access-token')
    deleteAllRoles() {
        return this.roleService.deleteAllRole();
    }
}
