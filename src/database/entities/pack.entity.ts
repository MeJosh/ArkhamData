import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('packs')
export class Pack {
  @PrimaryColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', unique: true })
  code!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'int', nullable: true })
  position!: number | null;

  @Column({ name: 'cycle_position', type: 'int', nullable: true })
  cyclePosition!: number | null;

  @Column({ type: 'varchar', nullable: true })
  available!: string | null;

  @Column({ type: 'int', nullable: true })
  known!: number | null;

  @Column({ type: 'int', nullable: true })
  total!: number | null;

  @Column({ type: 'varchar', nullable: true })
  url!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
