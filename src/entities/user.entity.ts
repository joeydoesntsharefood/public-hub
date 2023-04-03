import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstAccess: boolean;

  @Column()
  accessLevel: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  areaOfIntrest: string;

  @Column()
  partOf: boolean;

  @Column()
  email: string;

  @Column()
  corpEmail: string;

  @Column()
  corp: string;

  @Column()
  role: string;

  @Column()
  acceptTerms: boolean;

  @Column()
  passwordHash: string;

  @Column()
  passwordSalt: number;

  @Column()
  verificationToken: string;

  @Column()
  verifiedAt: string;

  @Column()
  passwordResetToken: string;

  @Column()
  resetTokenExpires: string;

  @Column()
  rpmId: number;

  @Column()
  instituition: string;

  @Column()
  lastName: string;

  @Column()
  occupation: string;

  @Column()
  chain: string;

  @Column()
  cpf: string;

  @Column({ nullable: true })
  seasonDate?: string;
}
