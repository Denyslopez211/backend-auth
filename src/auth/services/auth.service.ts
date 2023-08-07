import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../entities';
import { LoginUserDto, CreateUserDto } from '../dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthHistoryService } from './auth-history.service';
import { ResponseUser } from '../interfaces';
import { UtilsService } from './utils.service';
import { MESSAGE, TYPE_TRIED } from '../constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly authHistoryService: AuthHistoryService,
    private readonly utilsService: UtilsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userDate } = createUserDto;

      const user = this.userRepository.create({
        ...userDate,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      return `username: ${user.username} successfully created`;
    } catch (error) {
      this.utilsService.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<ResponseUser> {
    const { password, email } = loginUserDto;
    const user = await this.findUserForEmail(email);
    if (!user) throw new UnauthorizedException(MESSAGE.validCredential);

    await this.validateUser(user, password);
    await this.authHistoryService.createHistory(user, TYPE_TRIED.success);
    const { username, id } = user;

    return {
      user: { id, username, email },
      token: this.getJwtToken({ email, username }),
    };
  }

  private async validateUser(user: User, password: string): Promise<void> {
    if (!bcrypt.compareSync(password, user.password)) {
      await this.authHistoryService.createHistory(user, TYPE_TRIED.fail);
      throw new UnauthorizedException(MESSAGE.validCredential);
    }
  }

  private async findUserForEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { email, isActive: true },
        select: {
          email: true,
          username: true,
          password: true,
          id: true,
        },
      });
    } catch (error) {
      this.utilsService.handleDBError(error);
    }
  }

  async checkAuthStatus(idUser: string) {
    const user = await this.findUserForId(idUser);
    const { email, username } = user;

    return {
      user,
      token: this.getJwtToken({ email, username }),
    };
  }

  private async findUserForId(id: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { id },
        select: {
          email: true,
          username: true,
          id: true,
        },
      });
    } catch (error) {
      this.utilsService.handleDBError(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
