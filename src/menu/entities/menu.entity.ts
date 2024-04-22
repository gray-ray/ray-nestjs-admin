import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  TreeChildren,
  TreeParent,
  Tree,
  TreeLevelColumn,
} from 'typeorm';

// 树实体
@Entity('menus')
@Tree('closure-table')
export class Menu {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'menu_name', length: 30 })
  menuName: string;

  @Column()
  type: string;

  @Column({ name: 'sort_num' })
  sortNum: number;

  @Column()
  component: string;

  @Column()
  route: string;

  @Column()
  status: boolean;

  @Column()
  show: boolean;

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

  @Column({ name: 'app_id' })
  appId: number;

  @TreeParent()
  parent: Menu;

  @TreeChildren()
  children: Menu[];
}
