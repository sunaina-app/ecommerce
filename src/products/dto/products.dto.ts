import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { Allow, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class ProductDto {

    @IsString()
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters long' })
    @ApiProperty({
        example: "mango",
        description: 'Product Name'
    })
    name!: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @ApiProperty({
        example: 6,
        description: 'Product Quantity'
    })
    quantity!: number;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @ApiProperty({
        example: 78,
        description: 'Product price'
    })
    price!: number;

    @IsString()
    @Length(3, 30, { message: 'Variant must be between 3 and 30 characters long' })
    @ApiProperty({
        example: "Desi Mango",
        description: 'Product Variant'
    })
    variant!: string

    @Allow()
    @ApiProperty({ type: 'array', items: { type:'string', format: 'binary' } })
    image!: any[];
}

export class UpdateProductDto {

    @IsString()
    @IsOptional()
    @Length(3, 50)
    @Transform(({ value }) => value === '' ? undefined : value)
    @ApiPropertyOptional({
        example: "mango",
        description: 'Product Name'
    })
    name?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @ApiPropertyOptional({
        example: 6,
        description: 'Product Quantity'
    })
    quantity?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @ApiPropertyOptional({
        example: 78,
        description: 'Product price'
    })
    price?: number;

    @IsString()
    @IsOptional()
    @Length(3, 30)
    @Transform(({ value }) => value === '' ? undefined : value)
    @ApiPropertyOptional({
        example: "Desi Mango",
        description: 'Product Variant'
    })
    variant?: string

    @Allow()
    @IsOptional()
    @ApiPropertyOptional({ type: 'array', items: { type:'string', format: 'binary' } })
    image?: any[];
}