import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';

@Module({
  providers: [UsersService],
  exports:[UsersService],
  controllers: [UsersController],
  imports: [MongooseModule.forFeature([{name: Users.name, schema:UsersSchema}])]
})
export class UsersModule {}
