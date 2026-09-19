import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProductsDocument = HydratedDocument<Products>;

@Schema({timestamps:true})

export class Products{

    @Prop()
    name!:string;
    
    @Prop()
    quantity!:number;
    
    @Prop()
    price!:number;
    
    @Prop()
    variant!:string;

    @Prop()
    images!:string[];

}

export const ProductsSchema = SchemaFactory.createForClass(Products);