import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from './schemas/order.schema';
import { CartModule } from 'src/cart/cart.module';
import { ProductsModule } from 'src/products/products.module';
import { OrderItemsModule } from 'src/order_items/order_items.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports:[CartModule,ProductsModule,OrderItemsModule,MongooseModule.forFeature([{name:Order.name,schema:orderSchema}])]
})
export class OrderModule {}
