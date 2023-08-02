import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../decorators/get-user.decorator';
import { AuthService } from '../services';
import { User } from '../entities';
import { CreateUserDto, LoginUserDto } from '../dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User was created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  // @ApiResponse({ status: 200, description: 'User was created' type: })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('user')
  @UseGuards(AuthGuard())
  @ApiExcludeEndpoint()
  getUser(@GetUser() user: User) {
    return user;
  }
}
