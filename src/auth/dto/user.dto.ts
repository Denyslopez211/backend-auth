import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: '45646-456456-456456-456',
    description: 'id',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'denyslope21@gmail.com',
    description: 'Email',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'Denys Lopez',
    description: 'Username',
  })
  @IsString()
  username: string;
}
