import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TYPE_TRIED } from '../constants';

export class UserHistoryDto {
  @ApiProperty({
    example: 'Denys Lopez',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: true,
  })
  @IsString()
  isActive: boolean;

  @ApiProperty({
    example: [TYPE_TRIED.success, TYPE_TRIED.fail],
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '2023-10-26',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: '3',
  })
  @IsString()
  tried: string;
}
