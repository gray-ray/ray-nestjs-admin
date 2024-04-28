import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 30 })
  username: string;

  @Exclude()
  @Column({ select: false, nullable: true })
  password: string;

  @Column({ length: 30 })
  nickname: string;

  @Column()
  status: boolean;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @Column()
  email: string;

  @Column({ length: 11 })
  phone: string;

  @Column()
  remark: string;

  @ManyToMany(() => Role, (role) => role.users, { lazy: true })
  @JoinTable({
    name: 'users_roles',
  })
  roles: Role[];
}
