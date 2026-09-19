import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";


export type CartDocument = HydratedDocument<Cart>;

@Schema({timestamps:true})

export class Cart{

    @Prop({type: Types.ObjectId, ref: 'Products', required:true})
    product_id!:Types.ObjectId;
    
    @Prop()
    quantity!:number;

    @Prop()
    name!:string;

    @Prop()
    price!:number;

    @Prop()
    variant!:string;

    @Prop()
    product_images!: string[]

    @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
    user_id!:Types.ObjectId
}

export const CartSchema = SchemaFactory.createForClass(Cart);