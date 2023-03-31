import { object, string, TypeOf, z } from "zod";
import { UserRole } from "../entities/user.entity";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required"
    }).min(3, "Name must be at least 3 characters long"),

    email: string({
      required_error: "Email is required"
    }).email("Email must be a valid email"),

    password: string({
      required_error: "Password is required"
    })
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long"),

    passwordConfirmation: string({
      required_error: "Please confirm your password"
    }),

    role: z.optional(z.nativeEnum(UserRole))
  }).refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords do not match"
  })
});

export const loginSchema = object({
  body: object({
    email: string({
      required_error: "Email is required"
    }).email("Email must be a valid email"),

    password: string({
      required_error: "Password is required"
    })
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long")
  })
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>["body"],
  "passwordConfirmation"
>;
export type LoginInput = TypeOf<typeof loginSchema>["body"];
