import express from "express";
import { validate } from "../middleware/validate";
import { createUserSchema, loginSchema } from "../schemas/user.schema";
import {
  loginUserHandler,
  refreshAccessTokenHandler,
  registerHandler
} from "../controller/auth.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.post("/register", validate(createUserSchema), registerHandler);

router.post("/login", validate(loginSchema), loginUserHandler);

router.get("/logout", deserializeUser, requireUser, loginUserHandler);

router.get("/refresh", refreshAccessTokenHandler);

export default router;
