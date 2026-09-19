import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class UserResponseDto {

    @Expose()
    @Transform(({value}) => value.toString())
    _id!: string;

    @Expose()
    username!: string;

    @Expose()
    email!: string;

    @Expose()
    mobileNo?: string;

    @Expose()
    role!: string;

    @Expose()
    profile_photo!: string;

    @Exclude()
    password!: string;

    @Exclude()
    refresh_token?: string;
}