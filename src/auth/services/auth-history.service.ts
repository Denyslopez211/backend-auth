import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../dto';
import { History } from '../entities';
import { UserHistoryDto } from '../dto/user-history.dto';
import { UtilsService } from './utils.service';
import { TYPE_TRIED } from '../constants';

@Injectable()
export class AuthHistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly utilsService: UtilsService,
  ) {}

  async createHistory(
    loginUserDto: CreateUserDto,
    typeTried: TYPE_TRIED,
  ): Promise<void> {
    try {
      const history = this.historyRepository.create({
        description: typeTried,
        user: loginUserDto,
      });

      await this.historyRepository.save(history);
    } catch (error) {
      this.utilsService.handleDBError(error);
    }
  }

  async getAllHistory(): Promise<UserHistoryDto[]> {
    return this.utilsService.queryHistoryUser();
  }

  async getForUserHistory(userId: string): Promise<UserHistoryDto[]> {
    return this.utilsService.queryHistoryUser(userId);
  }
}
