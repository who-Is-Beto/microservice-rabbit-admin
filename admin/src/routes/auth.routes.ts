import express from "express";
import { validate } from "../middleware/validate";
import { createUserSchema, loginSchema } from "../schemas/user.schema";
import {
  loginUserHandler,
  logoutUserHandler,
  refreshAccessTokenHandler,
  registerHandler
} from "../controller/auth.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

// Register user
router.post('/register', validate(createUserSchema), registerHandler);

// Login user
router.post('/login', validate(loginSchema), loginUserHandler);

// Logout user
router.get('/logout', deserializeUser, requireUser, logoutUserHandler);

// Refresh access token
router.get('/refresh', refreshAccessTokenHandler);

export default router;
