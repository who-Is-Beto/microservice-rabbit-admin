import { Column, Entity, Index } from "typeorm";
import Model from "./model.entity";

export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}

@Entity("users")
export class User extends Model {
  @Column()
  name: string;

  @Index("email_index")
  @Column({ unique: true })
  email: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole.USER;

  @Column({
    default: "image.png"
  })
  photo: string;

  @Column({
    default: false
  })
  verified: boolean;

  toJSON() {
    return {
      ...this,
      password: undefined,
      verified: undefined
    };
  }
}
