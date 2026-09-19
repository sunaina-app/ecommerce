import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type OrderItemsDocument = HydratedDocument<OrderItems>;

@Schema()
export class OrderItems {

    @Prop({type:Types.ObjectId,ref:"Order",required:true})
    order_id!: Types.ObjectId

    @Prop()
    product_id!: string

    @Prop()
    quantity!: number

    @Prop()
    price!: number

}

export const OrderItemsSchema = SchemaFactory.createForClass(OrderItems);