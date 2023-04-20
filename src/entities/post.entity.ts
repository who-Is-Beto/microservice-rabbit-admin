import { Column, Entity, Index } from 'typeorm';
import Model from './model.entity';

@Entity('posts')
export class Post extends Model {
  @Column()
  title: string;

  @Column()
  content: string;

  // @Index('user_id_index')
  @Column()
  user_id: string;

  toJSON() {
    return {
      ...this,
    };
  }
}
