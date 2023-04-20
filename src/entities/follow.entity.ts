import { Column, Entity } from 'typeorm';
import Model from './model.entity';

export enum FollowStatus {
  blocked = 'blocked',
  accepted = 'accepted',
  pending = 'pending',
}

@Entity('follows')
export class Follows extends Model {
  @Column()
  user_to_id: string;

  @Column()
  user_from_id: string;

  @Column({
    type: 'enum',
    enum: FollowStatus,
    default: FollowStatus.pending,
  })
  status: FollowStatus;
}
