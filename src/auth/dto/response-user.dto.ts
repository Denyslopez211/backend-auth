import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class ResponseUserDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  @IsString()
  toke: string;
}
