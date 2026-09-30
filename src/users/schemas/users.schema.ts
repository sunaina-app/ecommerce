import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Roles } from "src/roles/schemas/roles.schema";

export type  UsersDocument = HydratedDocument<Users>;

@Schema({timestamps:true})

export class Users{

    @Prop()
    username!:string;

    @Prop({unique:true})
    email!: string;

    @Prop()
    password!:string;

    @Prop()
    mobileNo?:string;

    // @Prop({type: String, enum: Role, default: Role.User})
    // role!:Role;

    @Prop({
        type: Types.ObjectId,
        ref: 'Roles'
    })
    role!:Roles

    @Prop()
    profile_photo!: string

    @Prop()
    refresh_token?: string

}

export const UsersSchema = SchemaFactory.createForClass(Users);