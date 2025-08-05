import {
    Controller, Post, Get, Patch, Delete, Param, Body, UseGuards
} from '@nestjs/common';
import {
    ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody
} from '@nestjs/swagger';
import { JwtAuthGuard, ManagerGuard } from 'src/guards';
import { Roles } from 'src/decorators/roles.decorator';
import { URole } from 'src/enum';
import { PrepStationService } from './prep-station.service';
import { CreatePrepStationDto } from './dto/create-prep-station.dto';
import { UpdatePrepStationDto } from './dto/update-prep-station.dto';

@ApiTags('prep-stations')
@Controller('prep-stations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ManagerGuard)
@Roles(URole.MANAGER)
export class PrepStationController {
    constructor(private readonly prepStationService: PrepStationService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new prep station' })
    @ApiBody({ type: CreatePrepStationDto })
    @ApiResponse({ status: 201, description: 'Prep station created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request (validation failed)' })
    @ApiResponse({ status: 409, description: 'Prep station with same name already exists' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    create(@Body() dto: CreatePrepStationDto) {
        return this.prepStationService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all prep stations' })
    @ApiResponse({ status: 200, description: 'List of prep stations returned successfully' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    findAll() {
        return this.prepStationService.findAll();
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing prep station' })
    @ApiBody({ type: UpdatePrepStationDto })
    @ApiResponse({ status: 200, description: 'Prep station updated successfully' })
    @ApiResponse({ status: 404, description: 'Prep station not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    update(@Param('id') id: string, @Body() dto: UpdatePrepStationDto) {
        return this.prepStationService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a prep station' })
    @ApiResponse({ status: 200, description: 'Prep station deleted successfully' })
    @ApiResponse({ status: 404, description: 'Prep station not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    remove(@Param('id') id: string) {
        return this.prepStationService.remove(id);
    }
}
