import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class OrderItemDto {

    @IsString()
    @ApiProperty({
        example: "66d8f1c2a4b5e6f789123456",
        description: 'Product Id to place order'
    })
    product_id!: string;

    @IsNumber()
    @ApiProperty({
        example: 3,
        description: 'Product quantity to place order'
    })
    quantity!: number
}