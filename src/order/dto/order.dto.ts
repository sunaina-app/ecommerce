import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator"
import { OrderItemDto } from "src/order_items/dto/order_items.dto"

export class OrderDto {

    @IsString()
    @ApiProperty({
        example: 'noida',
        description: 'Placed order address'
    })
    shipping_address!: string

    @IsNumber()
    @ApiProperty({
        example: 5,
        description: 'How much tax is added'
    })
    tax!: number

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    @ApiProperty({
        type: [OrderItemDto],
        example: [{
            product_id: '66d8f1c2a4b5e6f789123456',
            quantity: 2
        }],
        description: 'List of products to be added to the order'
    })
    items!: OrderItemDto[];

}