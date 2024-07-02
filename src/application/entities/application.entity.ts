import { Column, PrimaryGeneratedColumn, Entity, ManyToMany } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'app_name' })
  appName: string;


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

  @ManyToMany(() => Role, (role) => role.apps)
  roles: Role[];

}
