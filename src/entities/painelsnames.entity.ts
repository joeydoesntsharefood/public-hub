import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PainelsNames' })
export class PainelsNames {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  inUse: boolean;
}
