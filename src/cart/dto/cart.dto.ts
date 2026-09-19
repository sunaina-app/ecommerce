import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CartDto {

    @IsMongoId()
    @IsNotEmpty()
    @ApiProperty({
        example: '66d8f1c2a4b5e6f789123456',
        description: 'Product that needs to be added to cart'
    })
    productId!: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    @ApiPropertyOptional({
        example: 2,
        description: 'Product quantity needs to be added in the cart'
    })
    quantity?: number
}

export class DeleteCartDto {
  @IsMongoId({ each: true })
  productId !: string[];
}