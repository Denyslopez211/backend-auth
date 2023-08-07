import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthHistoryService, AuthService } from './services';
import { UtilsService } from './services/utils.service';
import { AuthHistoryController, AuthController } from './controllers';
import { History, User } from './entities';

@Module({
  controllers: [AuthController, AuthHistoryController],
  providers: [AuthService, AuthHistoryService, JwtStrategy, UtilsService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, History]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: config.get('JWT_EXPIRE'),
          },
        };
      },
    }),
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
