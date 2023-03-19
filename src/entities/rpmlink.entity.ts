import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'RPMLink' })
export class RPMLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;
}
