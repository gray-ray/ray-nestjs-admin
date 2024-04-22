import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'app_name' })
  appName: string;
}
