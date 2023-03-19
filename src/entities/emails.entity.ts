import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Emails' })
export class Emails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column()
  template: string;

  @Column()
  success: string;

  @Column({ type: 'datetime' })
  date: Date;
}
