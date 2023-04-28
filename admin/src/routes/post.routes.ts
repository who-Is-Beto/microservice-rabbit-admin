import { Router } from 'express';
import { requireUser } from '../middleware/requireUser';
import { deserializeUser } from '../middleware/deserializeUser';
import { validate } from '../middleware/validate';
import { createPostSchema } from '../schemas/post.schema';
import { createPostHandler } from '../controller/post.controller';

const router = Router();

router.use(deserializeUser, requireUser);

router.post('/create', validate(createPostSchema), createPostHandler);

export default router;
