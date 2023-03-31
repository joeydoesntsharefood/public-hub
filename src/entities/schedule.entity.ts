import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Schedule' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @Column()
  isEventOpen: boolean;

  @Column()
  hostId: string;

  @Column()
  eventName: string;

  @Column()
  chain: string;

  @Column()
  placeId: number;

  @Column()
  placeName: string;

  @Column()
  startAt: string;

  @Column()
  endAt: string;

  @Column()
  invitesId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  participatedUsers: string | null;
}
