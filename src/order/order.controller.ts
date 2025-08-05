import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/entities/order.entity';

@ApiTags('orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, type: Order })
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiResponse({ status: 200, type: Order })
  async getOrder(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Patch('cancel/:id')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  async cancelOrder(@Param('id') id: string): Promise<{ message: string }> {
    return this.orderService.cancelOrder(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of orders for the authenticated client' })
  @ApiResponse({ status: 200, type: [Order] })
  async getOrders(@Request() req: any, @Query('active') active?: string): Promise<Order[]> {
    const clientId = req.user.uuid; // assuming JWT attaches user uuid here
    const onlyActive = active === 'true';
    return this.orderService.findOrdersByClient(clientId, onlyActive);
  }
}
