import { DeepPartial } from 'typeorm';
import { Post } from '../entities/post.entity';
import { AppDataSource } from '../utils/data-source';

const postRepository = AppDataSource.getRepository(Post);

export const createPost = async (input: DeepPartial<Post>) => {
  return await postRepository.save(postRepository.create(input));
};

export const findPostById = async (postId: string) => {
  return await postRepository.findOneBy({ id: postId });
};

export const editPost = async (postId: string, input: DeepPartial<Post>) => {
  return await postRepository.update(postId, input);
};

export const deletePost = async (postId: string) => {
  return await postRepository.delete(postId);
};

export const findPostsByUserId = async (userId: string) => {
  return await postRepository.find({
    where: {
      user_id: userId,
    },
  });
};
