import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { GetRestaurantDto } from './dto/get-restaurant.dto';
import { JwtAuthGuard } from 'src/guards';
import { Restaurant } from 'src/entities';

@ApiTags('restaurants')
@ApiBearerAuth()
@Controller('restaurants')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get list of restaurants' })
    @ApiResponse({ status: 200, type: [Restaurant] })
    async getAll(@Query() filters: GetRestaurantDto): Promise<Restaurant[]> {
        return this.restaurantService.findAll(filters);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':uuid')
    @ApiOperation({ summary: 'Get restaurant by UUID' })
    @ApiResponse({ status: 200, type: Restaurant })
    async getOne(@Param('uuid') uuid: string): Promise<Restaurant> {
        return this.restaurantService.findOne(uuid);
    }

    @Get('qr/scan/:tableId')
    @ApiOperation({ summary: 'Scan table QR code and get restaurant info + menu' })
    async scanTable(@Param('tableId') tableId: string) {
        return this.restaurantService.scanTable(tableId);
    }
}
