import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../decorators/get-user.decorator';

import { AuthHistoryService } from '../services';
import { User } from '../entities/user.entity';
import { History } from '../entities';

@ApiTags('Auth-history')
@Controller('auth-history')
export class AuthHistoryController {
  constructor(private readonly authHistoryService: AuthHistoryService) {}

  @Get('/')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'ok', type: [History] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getForUserHistory(@GetUser() user: User) {
    return this.authHistoryService.getForUserHistory(user);
  }

  @Get('all')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'ok', type: [History] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getAllHistory() {
    return this.authHistoryService.getAllHistory();
  }
}
