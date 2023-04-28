import express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { followHandler, getFollowersHandler } from '../controller/follow.controller';
import { validate } from '../middleware/validate';
import { createFollowSchema } from '../schemas/follow.schema';

const router = express.Router();
router.use(deserializeUser, requireUser);

router.post('/', validate(createFollowSchema), followHandler);
router.get('/', getFollowersHandler);

export default router;
