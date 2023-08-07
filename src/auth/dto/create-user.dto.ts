import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MESSAGE } from '../constants';

export class CreateUserDto {
  @ApiProperty({
    example: 'denyslope21@gmail.com',
    description: 'Email',
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'D3ni5l0p3z21',
    description: 'Password',
    minimum: 6,
    maximum: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: MESSAGE.validPassword,
  })
  password: string;

  @ApiProperty({
    example: 'Denys Lopez',
    description: 'Username',
    minimum: 4,
    maximum: 50,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  username: string;
}
