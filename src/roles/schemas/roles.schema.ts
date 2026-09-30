import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Permission } from "src/permission/schemas/permission.schema";

export type RolesDocument = HydratedDocument<Roles>;

@Schema({timestamps:true})
export class Roles{

    @Prop({unique:true})
    name!:string;

    @Prop({
        type:[{type: Types.ObjectId, ref: 'Permission'}]
    })
    permissions!: Permission[]

}

export const RoleSchema = SchemaFactory.createForClass(Roles);