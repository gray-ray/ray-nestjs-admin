import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  TreeChildren,
  TreeParent,
  Tree,
  TreeLevelColumn,
  ManyToOne,
} from 'typeorm';

import { Application } from 'src/application/entities/application.entity';

// 树实体
@Entity('menus')
@Tree('closure-table')
export class Menu {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'menu_name', length: 30 })
  menuName: string;

  @Column({default: ''})
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

  @TreeParent()
  parent: Menu;

  @TreeChildren()
  children: Menu[];

  @Column({
    name: 'app_id',
  })
  appId: number;

  @Column({
    name: 'parent_id',
    default: 0,
  })
  parentId: number;
}
