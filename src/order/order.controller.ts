import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { Types } from 'mongoose';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller({
    path: 'order',
    version: '1',
})
export class OrderController {

    constructor(private readonly order: OrderService) { }

    @Post('/placeOrder')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    @ApiOperation({summary :'Place Order'})
    @ApiBearerAuth('access-token')

    orderPlace(@Request() request:any, @Body() orderDto: OrderDto) {
        const userId = new Types.ObjectId(request.user.sub);
        return this.order.processOrder(userId, orderDto);
    }

}
