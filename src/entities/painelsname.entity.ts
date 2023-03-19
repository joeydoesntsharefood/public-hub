import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Painels' })
export class Painels {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  inUse: boolean;
}
