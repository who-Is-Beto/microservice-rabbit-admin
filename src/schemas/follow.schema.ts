import { TypeOf, object, string } from 'zod';

export const createFollowSchema = object({
  body: object({
    user_from_id: string({
      required_error: 'User ID is required',
    }).min(1, 'User ID is required'),

    user_to_id: string({
      required_error: 'Follower ID is required',
    }).min(1, 'Following ID is required'),

    user_to_username: string({
      required_error: 'Follower username is required',
    }).min(1, 'Following username is required'),
  }),
});

export type CreateFollowInput = TypeOf<typeof createFollowSchema>['body'];
