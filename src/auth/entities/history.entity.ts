import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('history')
export class History {
  @ApiProperty({
    example: '345335-678768-fh4fh-45634',
    description: 'History ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Failed login',
    description: 'Type of action performed',
  })
  @Column('varchar')
  description: string;

  @ApiProperty({
    example: '2023-08-02T17:28:17.219Z',
    description: 'Action creation date',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.history, { eager: true })
  user: User;
}
