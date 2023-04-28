import { TypeOf, object, string, z } from 'zod';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const createPostSchema = object({
  body: object({
    title: string({
      required_error: 'Title is required',
    }).min(3, 'Title must be at least 3 characters long'),

    content: string({
      required_error: 'Content is required',
    }).min(3, 'Content must be at least 3 characters long'),
  }),
});
export type CreatePostInput = TypeOf<typeof createPostSchema>['body'];
