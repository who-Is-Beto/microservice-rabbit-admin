import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";

export enum FollowStatus {
  blocked = "blocked",
  accepted = "accepted",
  pending = "pending"
}

@Entity('follows')
export class Follows extends Model {
  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable({name: 'followers_id'})
  followers: User[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({name: 'following_id'})
  following: User;

  @Column({type: 'enum', enum: FollowStatus, default: FollowStatus.pending})
  status: FollowStatus;
}