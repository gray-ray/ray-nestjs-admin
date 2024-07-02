import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Application } from 'src/application/entities/application.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'role_name', length: 30 })
  roleName: string;

  @Column()
  code: string;

  @Column({
    default: 1,
  })
  status: boolean;

  @Column({
    default: '',
  })
  remark: string;

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

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Application, (app) => app.roles, { lazy: true, eager: false })
  @JoinTable({
    name: 'roles_apps',
  })
  apps: Application[];
}
