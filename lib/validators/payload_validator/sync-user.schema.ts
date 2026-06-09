import { z } from "zod";

export const SyncSchema = z.object({
    timezone: z.string().min(1, {message: "Timezone is required"}),
    currency: z.string().min(1, {message: "Currency is required"})
});

export type SyncSchemaType = z.infer<typeof SyncSchema>;