import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema({timestamps:true})
export class Order{
    
    @Prop({type:Types.ObjectId,ref:"User",required:true})
    user_id!:Types.ObjectId

    @Prop()
    status!:number

    @Prop()
    shipping_address!:string

    @Prop()
    tax!:number

    @Prop()
    grand_total!:number

    @Prop()
    total_amount!:number
}

export const orderSchema = SchemaFactory.createForClass(Order);