import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from '../decorators';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthService } from '../services';
import { CreateUserDto, LoginUserDto, ResponseUserDto } from '../dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // @ApiExcludeEndpoint()
  @ApiResponse({ status: 201, description: 'User was created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User was created',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-token')
  @ApiBearerAuth()
  @Auth()
  checkTokenUser(@GetUser() idUser: string) {
    return this.authService.checkAuthStatus(idUser);
  }
}
