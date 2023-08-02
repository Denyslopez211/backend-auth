import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../dto';
import { History } from '../entities';

@Injectable()
export class AuthHistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async createHistory(loginUserDto: CreateUserDto): Promise<void> {
    try {
      const history = this.historyRepository.create({
        description: 'Failed login',
        user: loginUserDto,
      });

      await this.historyRepository.save(history);
    } catch (error) {
      console.log(error);
      this.handleDBError(error);
    }
  }

  async getAllHistory(): Promise<History[]> {
    return await this.historyRepository.find();
  }

  async getForUserHistory(user: CreateUserDto): Promise<History[]> {
    return this.historyRepository.find({ where: { user } });
  }

  private handleDBError(error: any): never {
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
