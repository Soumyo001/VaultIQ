import z from "zod";
import { SUPPORTED_CODES } from "@/lib/utils/currency-util/currency";

export const CreateAccountSchema = z.object({
    name: z.string().trim()
        .min(1, {message: "Account name is required"})
        .max(100, {message: "Account name cannot exceed 100 characters"}),
    type: z.enum(["checking", "savings", "credit", "cash", "investment"]),
    currency: z.enum(SUPPORTED_CODES, {
        error: (issue) => {
            if(issue.code === "invalid_value") 
                return { message: "Invalid currency code" }
            return { message: "Currency code is required" }
        },
    }),
    initial_balance: z.number().default(0),
    color: z.string()
        .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
        .default("#6366f1"),
    icon: z.string().default("wallet")
});

export const UpdateAccountSchema = z.object({
    name: z.string().trim()
        .min(1, {message: "Account name cannot be empty"})
        .max(100, {message: "Account name cannot exceed at most 100 characters"})
        .optional(),
    type: z.enum(["checking", "savings", "credit", "cash", "investment"]).optional(),
    color: z.string()
        .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
        .optional(),
    icon: z.string().optional(),
    is_archived: z.boolean().optional()
});

export type CreateAccountSchemaType = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountSchemaType = z.infer<typeof UpdateAccountSchema>;