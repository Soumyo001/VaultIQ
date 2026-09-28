import { Types } from "mongoose";
import z from "zod";

const isValidObjectID = (val: string) => Types.ObjectId.isValid(val);

export const CreateTransactionSchema = z.object({
    account_id: z.string()
        .refine(data => isValidObjectID(data), {
            message: "Invalid Account"
        }),
    category_id: z.string()
        .refine(data => isValidObjectID(data), {
            message: "Invalid category"
        }).optional(),
    type: z.enum(["income", "expense", "transfer"], {
        error: (issue) => {
            if(issue.code === "invalid_value") {
                return { message: "Invalid transaction type" }
            }
            return { message: "Transaction type is required" }
        }
    }),
    amount: z.number().int().positive()
        .min(1, {message: "Must transfer some amount to create a transaction"}),
    description: z.string()
        .min(1, {message: "Description of the transaction is required"})
        .max(200, {message: "Description cannot be larger than 200 characters"}),
    date: z.coerce.date({ message: "Must be a valid date" }),
    tags: z.array(z.string()).default([]),
    notes: z.string()
        .max(500, {message: "Note cannot exceed 500 characters"})
        .optional(),
    transfer_to_account_id: z.string()
        .refine(data => isValidObjectID(data), {
            message: "Invalid destination account"
        }).optional(), // must required if type is "transfer"
}).superRefine((data, ctx) => {
    if(data.type === "transfer") {
        if(!data.transfer_to_account_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["transfer_to_account_id"],
                message: "Destination account required for transfers"
            });
        } else if(data.transfer_to_account_id === data.account_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["transfer_to_account_id"],
                message: "Cannot transfer to same account"
            });
        }
        if(data.category_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["category_id"],
                message: "Cannot have category for transfers"
            });
        }
    } else {
        if(!data.category_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["category_id"],
                message: "Category is required for income/expense transactions"
            });
        }
        if(data.transfer_to_account_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["transfer_to_account_id"],
                message: "Cannot have destination account on income/expense transactions"
            });
        }
    }
});

export const UpdateTransactionSchema = z.object({
    amount: z.number().int().positive()
        .min(1, {message: "Must transfer some amount to create a transaction"})
        .optional(),
    description: z.string()
        .min(1, {message: "Description of the transaction is required"})
        .max(200, {message: "Description cannot be larger than 200 characters"})
        .optional(),
    date: z.coerce.date({ message: "Must be a valid date" }).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string()
        .max(500, {message: "Note cannot exceed 500 characters"})
        .optional(),
    category_id: z.string().refine(data => isValidObjectID(data), {
            message: "Invalid category"
        }).optional(),
});

export type CreateTransactionSchemaType = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionSchemaType = z.infer<typeof UpdateTransactionSchema>;