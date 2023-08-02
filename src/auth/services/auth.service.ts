import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../entities';
import { LoginUserDto, CreateUserDto } from '../dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthHistoryService } from './auth-history.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly authHistoryService: AuthHistoryService,
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
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) throw new UnauthorizedException('Credentials are not valid');

    if (!bcrypt.compareSync(password, user.password)) {
      await this.authHistoryService.createHistory(user);
      throw new UnauthorizedException('Credentials are not valid');
    }

    return {
      ...user,
      token: this.getJwtToken({ email: user.email, username: user.username }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBError(error: any): never {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
