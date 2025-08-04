import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderType } from 'src/enum';

class OrderItemDto {
  @ApiProperty({ description: 'Menu Item ID' })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ description: 'Quantity', example: 1 })
  @IsNotEmpty()
  quantity: number;
}


export class CreateOrderDto {
  @ApiProperty({ enum: OrderType, description: 'Type of order (DINE_IN, PICKUP, DELIVERY)' })
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty({ description: 'Table ID (Required for DINE_IN)', required: false })
  @IsUUID()
  @IsOptional()
  tableId?: string;

  @ApiProperty({ description: 'Delivery address (Required for DELIVERY)', required: false })
  @IsOptional()
  deliveryAddress?: string;

  @ApiProperty({ description: 'List of items', type: [OrderItemDto] })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
