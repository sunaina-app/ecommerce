import { BadRequestException, Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CartDto } from './dto/cart.dto';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('Cart')
@Controller({
    path: 'cart',
    version: '1',
})
export class CartController {

    constructor(private readonly cartService: CartService) { }

    @Post('/addProduct')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    @ApiOperation({ summary: 'Add product in the cart' })
    @ApiBearerAuth('access-token')

    addProductCart(@Request() request: any, @Body() cartDto: CartDto) {
        return this.cartService.addProductQuantityCart(request.user.sub, cartDto);
    }

    @Post('/deleteProduct')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    @ApiOperation({ summary: 'Delete Product from the cart' })
    @ApiBearerAuth('access-token')

    deleteProductCart(@Request() request: any, @Body() cartDto: CartDto) {
        return this.cartService.deleteProductQuantityCart(request.user.sub, cartDto);
    }

    @Get('/all/:userId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    @ApiOperation({ summary: 'Fetch all cart items' })
    @ApiBearerAuth('access-token')

    fetchCart(@Param('userId') userId: string) {
        if (!(Types.ObjectId.isValid(userId))) {
            throw new BadRequestException('Invalid user id');
        }
        const objectId = new Types.ObjectId(userId);
        return this.cartService.fetchAllCartProduct(objectId);
    }
}
