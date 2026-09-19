import { Module } from '@nestjs/common';
import { OrderItemsController } from './order_items.controller';
import { OrderItemsService } from './order_items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItems, OrderItemsSchema } from './schemas/order_items.schema';
import { CartModule } from 'src/cart/cart.module';

@Module({
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  imports:[MongooseModule.forFeature([{name:OrderItems.name,schema:OrderItemsSchema}]),CartModule],
  exports:[OrderItemsService]
})
export class OrderItemsModule {}
