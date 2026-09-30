import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsString } from "class-validator";

export class PermissionDto{

    @IsString()
    @ApiProperty({
        type:'string',
        example: 'product.create'
    })
    name!: string;

    @IsString()
    @ApiProperty({
        type:'string',
        example:'Action to create product'
    })
    description!:string;
}

export class UpdatePermissionDto{

    @IsMongoId()
    @ApiProperty({
        type:'string',
        example: '66d8f1c2a4b5e6f789123456'
    })
    id!:string
    
    @IsString()
    @ApiPropertyOptional({
        type:'string',
        example: 'product.create'
    })
    name?: string;

    @IsString()
    @ApiPropertyOptional({
        type:'string',
        example:'Action to create product'
    })
    description?:string;
}