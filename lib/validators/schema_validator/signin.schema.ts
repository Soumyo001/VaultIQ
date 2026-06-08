import { z } from "zod";

const usernameRegex = /^[a-zA-Z0-9]{4,64}$/;

export const SigninSchema = z.object({
    identifier: z.string()
            .min(1, {message: "Please enter email or username"})
            .refine(val => {
                if(val.includes('@')) {
                    return z.string().email().safeParse(val).success;
                }
                return usernameRegex.test(val);
            },
            {
                message: "Enter a valid email or username (4-64 alphanumeric characters only)",
                path: ["identifier"]
            }),
    password: z.string()
            .min(1, {message: "Please enter your password"})
});

export type SigninSchemaType = z.infer<typeof SigninSchema>;