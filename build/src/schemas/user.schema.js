"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const user_entity_1 = require("../entities/user.entity");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "Name is required"
        }).min(3, "Name must be at least 3 characters long"),
        email: (0, zod_1.string)({
            required_error: "Email is required"
        }).email("Email must be a valid email"),
        password: (0, zod_1.string)({
            required_error: "Password is required"
        })
            .min(8, "Password must be at least 8 characters long")
            .max(20, "Password must be at most 20 characters long"),
        passwordConfirmation: (0, zod_1.string)({
            required_error: "Please confirm your password"
        }),
        role: zod_1.z.optional(zod_1.z.nativeEnum(user_entity_1.UserRole))
    }).refine((data) => data.password === data.passwordConfirmation, {
        path: ["passwordConfirmation"],
        message: "Passwords do not match"
    })
});
exports.loginSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required"
        }).email("Email must be a valid email"),
        password: (0, zod_1.string)({
            required_error: "Password is required"
        })
            .min(8, "Password must be at least 8 characters long")
            .max(20, "Password must be at most 20 characters long")
    })
});
