import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";

export class RolesDto{

    @IsString()
    @ApiProperty({
        type: 'string',
        example: 'Admin'
    })
    name!:string;

    @IsArray()
    @IsString({each:true})
    @ApiProperty({
        type: 'string',
        isArray:true,
        example: ['product.create','product.update']
    })
    permission!:string[]

}

export class UpdateRolesDto{

    @IsMongoId()
    @ApiProperty({
        type: 'string',
        example: '66d8f1c2a4b5e6f789123456'
    })
    id!:string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        type: 'string',
        example: 'Admin'
    })
    name?:string;

    @IsArray()
    @IsString({each:true})
    @IsOptional()
    @ApiPropertyOptional({
        type: 'string',
        isArray: true,
        example: ['product.create','product.update']
    })
    permission?:string[]

}