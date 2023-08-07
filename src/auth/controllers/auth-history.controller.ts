import { Controller, Get } from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../decorators/get-user.decorator';
import { Auth } from '../decorators';
import { AuthHistoryService } from '../services';

import { UserHistoryDto } from '../dto/user-history.dto';

@ApiTags('Auth-history')
@Controller('auth-history')
export class AuthHistoryController {
  constructor(private readonly authHistoryService: AuthHistoryService) {}

  @Get('/')
  @Auth()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'ok', type: [UserHistoryDto] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getForUserHistory(@GetUser() id: string) {
    return this.authHistoryService.getForUserHistory(id);
  }

  @Get('all')
  @Auth()
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'ok',
    type: [UserHistoryDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getAllHistory() {
    return this.authHistoryService.getAllHistory();
  }
}
