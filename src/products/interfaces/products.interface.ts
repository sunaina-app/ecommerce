import { Types } from "mongoose"

export interface newProducts{
    _id:string,
    name:string,
    quantity:number,
    price:number,
    variant:string,
    images:string[]
}