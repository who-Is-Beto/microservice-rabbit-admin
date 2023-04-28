import { DeepPartial } from 'typeorm';
import { Follows } from '../entities/follow.entity';
import { AppDataSource } from '../utils/data-source';

export const followRepository = AppDataSource.getRepository(Follows);

export const createFollow = async (follow: DeepPartial<Follows>) => {
  return followRepository.save(followRepository.create(follow));
};

export const getFollowers = async (user_id: string) => {
  return followRepository.find({
    where: {
      user_to_id: user_id,
    },
  });
};
