import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Painels' })
export class Painels {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderExp: number;

  @Column()
  title: string;

  @Column()
  uri: string;

  @Column()
  painelId: number;

  @Column()
  painelTitle: string;
}
