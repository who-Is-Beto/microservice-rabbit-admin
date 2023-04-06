"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../middleware/validate");
const user_schema_1 = require("../schemas/user.schema");
const auth_controller_1 = require("../controller/auth.controller");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requireUser_1 = require("../middleware/requireUser");
const router = express_1.default.Router();
router.post("/register", (0, validate_1.validate)(user_schema_1.createUserSchema), auth_controller_1.registerHandler);
router.post("/login", (0, validate_1.validate)(user_schema_1.loginSchema), auth_controller_1.loginUserHandler);
router.get("/logout", deserializeUser_1.deserializeUser, requireUser_1.requireUser, auth_controller_1.loginUserHandler);
router.get("/refresh", auth_controller_1.refreshAccessTokenHandler);
exports.default = router;
