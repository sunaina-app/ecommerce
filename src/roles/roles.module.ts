import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PermissionModule } from 'src/permission/permission.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Roles, RoleSchema } from './schemas/roles.schema';
import { Permission, PermissionSchema } from 'src/permission/schemas/permission.schema';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports:[PermissionModule,MongooseModule.forFeature([{name:Roles.name,schema:RoleSchema},{name:Permission.name,schema:PermissionSchema}])],
  exports:[RolesService]
})
export class RolesModule {}
