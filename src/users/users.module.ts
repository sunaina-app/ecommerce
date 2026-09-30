import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { RolesModule } from 'src/roles/roles.module';
import { Roles, RoleSchema } from 'src/roles/schemas/roles.schema';

@Module({
  providers: [UsersService],
  exports:[UsersService],
  controllers: [UsersController],
  imports: [MongooseModule.forFeature([{name: Users.name, schema:UsersSchema},{name: Roles.name, schema:RoleSchema}]), RolesModule]
})
export class UsersModule {}
