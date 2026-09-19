import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CartService } from 'src/cart/cart.service';
import { ProductsService } from 'src/products/products.service';
import { OrderItemsService } from 'src/order_items/order_items.service';

@Injectable()
export class OrderService {

    constructor(
        @InjectModel(Order.name) private order: Model<Order>,
        private readonly cartService: CartService,
        private readonly productService: ProductsService,
        private readonly orderItemService: OrderItemsService

    ) { }

    async processOrder(userId: Types.ObjectId, orderDto: OrderDto) {

        const orderProductIds = orderDto.items.map(item => item.product_id);

        const orderObjectIds = orderProductIds.map(id => new Types.ObjectId(id));

        const matchingCartIds = await this.cartService.findInCartByProductIds(userId, orderObjectIds);

        if (matchingCartIds.length != orderObjectIds.length) {
            throw new BadRequestException('Some product IDs do not exist in cart');
        } else {
            const matchingProductQty = orderDto.items.every(orderItem => {
                return matchingCartIds.some(cartItem => {
                    return (
                        cartItem.product_id.toString() === orderItem.product_id &&
                        cartItem.quantity === orderItem.quantity
                    );
                })
            });

            if (!matchingProductQty) {
                throw new BadRequestException('Product quantity does not match cart');
            }

            const matchingProductIds = await this.productService.findByProductIds(orderObjectIds);
            if (matchingProductIds.length != orderProductIds.length) {
                throw new BadRequestException('Some product IDs do not exist');
            } else {

                let grandTotal = 0;

                const orderItems = orderDto.items.map(orderItem => {
                    const product = matchingProductIds.find(
                        product => product._id.toString() == orderItem.product_id
                    );

                    if (!product) {
                        throw new BadRequestException(
                            `Product ${orderItem.product_id} not found`
                        );
                    }

                    const itemTotal = product.price * orderItem.quantity;
                    grandTotal += itemTotal;

                    return {
                        product_id: product._id,
                        quantity: orderItem.quantity,
                        price: product.price
                    };
                });

                const newOrder = new this.order({
                    user_id: userId,
                    status: 1,
                    shipping_address: orderDto.shipping_address,
                    tax: orderDto.tax,
                    grand_total: grandTotal,
                    total_amount: grandTotal + (grandTotal * orderDto.tax / 100)
                });

                const updateOrder = await newOrder.save();

                const orderObject = updateOrder.toObject();

                const saveOrderitems = await this.orderItemService.addOrderitems(userId,updateOrder._id, orderItems);

                const orderItemsObject = saveOrderitems.map(item => {
                    const data = item.toObject();

                    return {
                        ...data,
                        _id: data._id.toString(),
                        order_id: data.order_id.toString(),
                    };
                });

                return {
                    order: {
                        ...orderObject,
                        _id: orderObject._id.toString(),
                        user_id: orderObject.user_id.toString(),
                    },
                    orderItems: orderItemsObject,
                };

            }
        }
    }
}
