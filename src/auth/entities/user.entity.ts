import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { History } from './history.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  username: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @OneToMany(() => History, (history) => history.user)
  history: History;

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
}
