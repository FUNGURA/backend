import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards';
import { GetUser } from 'src/decorators';
import { User } from 'src/entities';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get logged in user profile' })
  @ApiResponse({ status: 200, description: 'Profile fetched successfully' })
  getProfile(@GetUser() user: User) {
    return this.userService.getProfile(user.uuid);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update logged in user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  updateProfile(@GetUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(user.uuid, dto);
  }
}
