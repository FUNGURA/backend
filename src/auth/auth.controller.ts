import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefinedApiResponse } from 'src/payload/defined.payload';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, VerifyOtpDto } from './dto';
import { RegisterClientDto } from './dto';
import { JwtAuthGuard } from 'src/guards';

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

  @ApiOperation({ summary: 'Send OTP for password reset' })
  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const { email } = body;
    return new DefinedApiResponse(true, null, await this.authService.forgotPassword(email));
  }

  @ApiOperation({ summary: 'Verify OTP for password reset' })
  @Post('/verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const { email, otp } = body;
    return new DefinedApiResponse(true, null, await this.authService.verifyOtp(email, otp));
  }

  @ApiOperation({ summary: 'Reset password after OTP verification' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
  async resetPassword(@Request() req, @Body() body: ResetPasswordDto) {    
    const userId = req.user.userId;
    return new DefinedApiResponse(true, null, await this.authService.resetPassword(userId, body));
  }

}
