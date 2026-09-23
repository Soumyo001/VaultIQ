import z from "zod"

export const CreateCategorySchema = z.object({
    name: z.string().trim()
        .min(1, {message: "Category name is required"})
        .max(50, {message: "Category name cannot exceed 50 characters"}),
    type: z.enum(["income", "expense"], {
        error: (issue) => {
            if(issue.code === "invalid_value") 
                return {message: "Invalid category type"}
            return {message: "Category type is required"}
        }
    }),
    icon: z.string().default("circle"),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#6366f1"),
    parent_id: z.string().nullable().optional()
});

export const UpdateCategorySchema = z.object({
    name: z.string().trim()
        .min(1, {message: "Category name cannot be empty"})
        .max(50, {message: "Category name cannot exceed 50 characters"})
        .optional(),
    icon: z.string().optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
export type UpdateCategorySchemaType = z.infer<typeof UpdateCategorySchema>;