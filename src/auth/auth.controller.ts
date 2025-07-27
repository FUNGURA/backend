import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefinedApiResponse } from 'src/payload/defined.payload';
import { LoginDto } from './dto';
import { RegisterClientDto } from './dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Register a new client user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @Post('/register')
  async register(@Body() dto: RegisterClientDto) {
    return new DefinedApiResponse(
      true,
      null,
      await this.authService.register(dto)
    );
  }

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    return new DefinedApiResponse(
      true,
      null,
      await this.authService.login(dto),
    );
  }
}
