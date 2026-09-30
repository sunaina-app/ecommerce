import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Role } from "src/roles/roles.enum";

export class UserDto {

    @IsString()
    @ApiProperty({
        example: "Test",
        description: 'Username to signup'
    })
    username!: string;

    @IsString()
    @ApiProperty({
        example: "dadad3243434",
        description: 'Password to login'
    })
    password!: string;

    @IsString()
    @IsEmail()
    @ApiProperty({
        example: "test@gmail.com",
        description: 'Email to be added'
    })
    email!: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiPropertyOptional({
        example: 123456789,
        description: 'Mobile Number'
    })
    mobileNo?: number;

    @IsString()
    @ApiProperty({
        type: 'string',
        example: 'Admin'
    })
    role!: Role;

    @IsOptional()
    @ApiProperty({ type: 'string', format: 'binary' })
    image?: any;

}

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        example: "Test",
        description: 'Username to signup'
    })
    username?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiPropertyOptional({
        example: 123456789,
        description: 'Mobile Number'
    })
    mobileNo?: number;

    @IsString()
    @ApiProperty({
         type: 'string',
        example: 'Admin'
    })
    role?: Role;

    @IsOptional()
    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    image?: any;

}