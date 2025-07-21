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
import { ApiTags } from '@nestjs/swagger';
import { DefinedApiResponse } from 'src/payload/defined.payload';
import { LoginDto } from './dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
 async login(@Body() dto: LoginDto) {
    return new DefinedApiResponse(
      true,
      null,
      await this.authService.login(dto),
    );
  }
}
