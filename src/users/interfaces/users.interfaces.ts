import { Types } from "mongoose"

export interface UsersData{
    _id:Types.ObjectId
    username:string
    email: string
    password:string
    mobileNo?:string
    role:string
    profile_photo:string
    refresh_token?:string
}