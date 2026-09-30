import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './schemas/products.schema';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';

@Module({
  imports:[MongooseModule.forFeature([{name: Products.name, schema:ProductsSchema},{ name: Users.name, schema: UsersSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService]
})
export class ProductsModule {}
