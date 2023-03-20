import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'VideoCall' })
export class VideoCall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  invitesId: string;
}
