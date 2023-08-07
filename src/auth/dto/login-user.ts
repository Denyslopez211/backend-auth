import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { MESSAGE } from '../constants';

export class LoginUserDto {
  @ApiProperty({
    example: 'denyslopez21@gmail.com',
    description: 'Username',
  })
  @IsString()
  @IsEmail(
    {},
    {
      message: MESSAGE.validCredential,
    },
  )
  email: string;

  @ApiProperty({
    example: 'Abc123456',
    description: 'Password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: MESSAGE.validCredential,
  })
  password: string;
}
