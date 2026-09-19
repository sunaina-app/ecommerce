import { Types } from "mongoose"

export interface CartData{
    _id:string,
    user_id:string,
    product_id:string,
    name:string,
    quantity:number,
    price:number,
    variant:string,
    product_images:string[]
}