import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Exclude, Expose, Transform  } from 'class-transformer';
import { hashSync } from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 30 })
  username: string;

  @Exclude()
  @Column({ select: false, nullable: true })
  password: string;

  @Column({ length: 30,default: '' })
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

  @Column({default: ''})
  email: string;

  @Column({ length: 11, default: '' })
  phone: string;

  @Column({default: ''})
  remark: string;

  // NOTE:  通过懒加载方式防止循环引入需要注意, roles返回的是一个promise对象需要处理
  // 在 User 实体中，roles 属性被定义为懒加载（eager: false）。这意味着在默认情况下，roles 属性不会自动加载，我们需要显式地加载它们
  @ManyToMany(() => Role, (role) => role.users, { lazy: true, })
  @JoinTable({
    name: 'users_roles',
  })
  roles: Role[];

  // 插入 更新时触发
  @BeforeUpdate()
  @BeforeInsert()
  async encryptPwd() {
    if (!this.password) return;
    this.password = hashSync(this.password, 10);
  }


} 
