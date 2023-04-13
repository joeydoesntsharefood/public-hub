import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Analytics' })
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'datetime' })
  date: string;

  @Column()
  location?: string;

  @Column()
  painelId?: number;
}
