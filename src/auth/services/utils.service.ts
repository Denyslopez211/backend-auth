import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities';
import { UserHistoryDto } from '../dto/user-history.dto';
import { MESSAGE } from '../constants';

@Injectable()
export class UtilsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async queryHistoryUser(userId?: string): Promise<UserHistoryDto[]> {
    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('u')
        .select('u.username', 'username')
        .addSelect('u.isActive', 'isActive')
        .addSelect('DATE_FORMAT(hi.created_at, "%Y-%m-%d")', 'date')
        .addSelect('hi.description', 'description')
        .addSelect('COUNT(*) as tried')
        .innerJoin('history', 'hi', 'u.id = hi.userId')
        .groupBy('u.username, u.isActive, date, hi.description')
        .orderBy('username', 'DESC')
        .addOrderBy('date')
        .addOrderBy('tried', 'DESC');

      if (userId) {
        queryBuilder.where('u.id = :userId', { userId });
      }

      return queryBuilder.getRawMany();
    } catch (error) {
      this.handleDBError(error);
    }
  }

  public handleDBError(error: any): never {
    console.log(error);
    throw new InternalServerErrorException(MESSAGE.checkLog);
  }
}
