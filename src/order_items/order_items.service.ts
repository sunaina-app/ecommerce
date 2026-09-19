import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderItems } from './schemas/order_items.schema';
import { Model, Types } from 'mongoose';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderItemsService {

    constructor(@InjectModel(OrderItems.name)
    private orderItem: Model<OrderItems>,
        private readonly cartService: CartService
    ) { }

    async addOrderitems(userId: Types.ObjectId, id: Types.ObjectId, items: any[]) {

        const orderItems = items.map(item => ({
            ...item,
            order_id: id
        }));

        const newOrderItems = await this.orderItem.insertMany(orderItems);

        const orderProductIds = orderItems.map(item =>
            item.product_id.toString(),
        );

        await this.cartService.deleteMultipleProductQuantityCart(userId, {
            productId: orderProductIds,
        });

        return newOrderItems;
    }
}
