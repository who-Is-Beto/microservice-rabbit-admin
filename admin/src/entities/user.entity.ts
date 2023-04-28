import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';
import Model from './model.entity';
import bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User extends Model {
  @Column()
  name: string;

  @Index('email_index')
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole.USER;

  @Column({
    default: 'image.png',
  })
  photo: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @BeforeInsert()
  public async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  public static async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  toJSON() {
    return {
      ...this,
      password: undefined,
      verified: undefined,
    };
  }
}
