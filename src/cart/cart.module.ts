import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductsModule } from 'src/products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports:[CartService],
  imports:[ProductsModule,MongooseModule.forFeature([{name: Cart.name, schema:CartSchema}])]
})
export class CartModule {}
