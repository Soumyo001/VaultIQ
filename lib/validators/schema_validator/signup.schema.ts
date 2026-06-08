import { z } from "zod";

export const SignupSchema = z.object({
    email: z.string()
        .min(1, {message: "Please enter your email"})
        .email({
            message: "Please enter a valid email",
            pattern: z.regexes.html5Email
        }),
    username: z.string()
        .min(1, {message: "Please enter your username"})
        .min(4, {message: "Username must be at least 4 characters"})
        .max(64, {message: "Username cannot exceed 64 characters"})
        .regex(/^[a-zA-Z0-9]+$/, {message: "Only letters and numbers are allowed"}),
    password: z.string()
        .min(1, {message: "Please enter your password"})
        .min(8, {message: "Password must be at least 8 characters"})
        .regex(/[A-Z]/, "Must contain one uppercase letter")
        .regex(/[a-z]/, "Must contain one lowercase letter")
        .regex(/[0-9]/, "Must contain one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain special character"),
    passwordConfirm: z.string()
        .min(1, {message: "Please re-enter your password"}),
}).refine(
    data => data.password === data.passwordConfirm,
    {
        message: "Passwords do not match",
        path: ["passwordConfirm"]
    }
);

export type SignupSchemaType = z.infer<typeof SignupSchema>;