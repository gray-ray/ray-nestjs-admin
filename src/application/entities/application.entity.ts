import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'app_name' })
  appName: string;
}
