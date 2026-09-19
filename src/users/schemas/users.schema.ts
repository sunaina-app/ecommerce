import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role } from "src/roles/roles.enum";

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

    @Prop({type: String, enum: Role, default: Role.User})
    role!:Role;

    @Prop()
    profile_photo!: string

    @Prop()
    refresh_token?: string

}

export const UsersSchema = SchemaFactory.createForClass(Users);