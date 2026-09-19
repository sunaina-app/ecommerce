import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto{

    @IsString()
    @IsEmail()
    @ApiProperty({
        example: 'test@gmail.com',
        description: 'SignIn email'
    })
    email!: string;

    @IsString()
    @ApiProperty({
        example: '1234',
        description: 'SignIn password'
    })
    password!: string
}

export class RefreshTokenDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Refresh Token'
    })
    refresh_token!: string;
}