import { Column, PrimaryGeneratedColumn, Entity, ManyToMany } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'app_name' })
  appName: string;

  @ManyToMany(() => Role, (role) => role.apps)
  roles: Role[];
}
