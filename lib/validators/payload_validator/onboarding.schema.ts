import { z } from "zod";
import { SUPPORTED_CODES } from "@/lib/utils/currency-util/currency";

export const SyncSchema = z.object({
    timezone: z.string().min(1, {message: "Timezone is required"}),
    currency: z.enum(SUPPORTED_CODES, {message: "Unsupported currency"})
});

export type SyncSchemaType = z.infer<typeof SyncSchema>;