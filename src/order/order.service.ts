import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/orderItem.entity';
import { MenuItem } from 'src/entities/menuItem.entity';
import { Table as RestaurantTable } from 'src/entities/table.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemStatus, OrderStatus, OrderType } from 'src/enum';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
        @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
        @InjectRepository(MenuItem) private readonly menuItemRepo: Repository<MenuItem>,
        @InjectRepository(RestaurantTable) private readonly tableRepo: Repository<RestaurantTable>,
    ) { }

    async createOrder(dto: CreateOrderDto): Promise<Order> {
        if (dto.orderType === OrderType.IN_RESTAURANT && !dto.tableId) {
            throw new BadRequestException('Table ID is required for IN_RESTAURANT orders.');
        }
        if (dto.orderType === OrderType.DELIVERY && !dto.deliveryAddress) {
            throw new BadRequestException('Delivery address is required for DELIVERY orders.');
        }

        let table = null;
        if (dto.tableId) {
            table = await this.tableRepo.findOne({ where: { uuid: dto.tableId } });
            if (!table) throw new NotFoundException('Table not found');
        }

        // Prepare items
        const orderItems: OrderItem[] = [];
        for (const item of dto.items) {
            const menuItem = await this.menuItemRepo.findOne({
                where: { uuid: item.menuItemId },
                relations: ['prepStation'],
            });
            if (!menuItem) throw new NotFoundException(`Menu item ${item.menuItemId} not found`);

            const orderItem = this.orderItemRepo.create({
                menuItem,
                quantity: item.quantity,
                prepStation: menuItem.prepStation,
            });
            orderItems.push(orderItem);
        }

        const order = this.orderRepo.create({
            table,
            status: OrderStatus.RECEIVED,
            items: orderItems,
            orderType: dto.orderType,
            deliveryAddress: dto.deliveryAddress,
        });

        const savedOrder = await this.orderRepo.save(order);

        // Update order status based on item statuses
        await this.updateOrderStatus(savedOrder);
        return savedOrder;
    }

    async getOrderById(id: string): Promise<Order> {
        const order = await this.orderRepo.findOne({
            where: { uuid: id },
            relations: ['items', 'items.menuItem', 'table'],
        });
        if (!order) throw new NotFoundException(`Order with id ${id} not found`);
        return order;
    }

    async cancelOrder(id: string): Promise<{ message: string }> {
        const order = await this.orderRepo.findOne({ where: { uuid: id } });
        if (!order) throw new NotFoundException(`Order with id ${id} not found`);

        if (order.status === OrderStatus.CANCELLED) {
            throw new BadRequestException('Order is already cancelled');
        }

        order.status = OrderStatus.CANCELLED;
        await this.orderRepo.save(order);

        return { message: 'Order cancelled successfully' };
    }

    async findOrdersByClient(clientUuid: string, onlyActive = false): Promise<Order[]> {
        const where: FindOptionsWhere<Order> = {
            client: { uuid: clientUuid },
        };

        if (onlyActive) {
            where.status = OrderStatus.RECEIVED; // or you can add more statuses considered active
        }

        const orders = await this.orderRepo.find({
            where,
            relations: ['items', 'items.menuItem', 'table', 'bill'],
            order: { createdAt: 'DESC' },
        });

        if (!orders.length) {
            throw new NotFoundException('No orders found for this client.');
        }

        return orders;
    }

    private async updateOrderStatus(order: Order): Promise<void> {
        const items = await this.orderItemRepo.find({
            where: { order: { uuid: order.uuid } },
        });

        if (items.every(item => item.status === OrderItemStatus.SERVED)) {
            order.status = OrderStatus.COMPLETED;
        } else if (
            items.some(item =>
                [OrderItemStatus.PREPARING, OrderItemStatus.READY].includes(item.status),
            )
        ) {
            order.status = OrderStatus.PENDING;
        } else if (
            items.every(item => item.status === OrderItemStatus.PENDING)
        ) {
            order.status = OrderStatus.RECEIVED;
        }

        // Do not overwrite if order is cancelled
        if (order.status !== OrderStatus.CANCELLED) {
            await this.orderRepo.save(order);
        }
    }


}
