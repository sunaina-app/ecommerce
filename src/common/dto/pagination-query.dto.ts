import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationQueryDto {

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @ApiPropertyOptional({
        example: 1,
        default: 1,
        description: 'Page number to retrieve'
    })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    @ApiPropertyOptional({
        example: 10,
        default: 10,
        description: 'Number of records to return per page',
    })
    limit?: number = 10;
}