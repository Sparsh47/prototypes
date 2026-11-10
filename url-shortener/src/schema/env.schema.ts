import z from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.string(),
    DIRECT_URL: z.string(),
    BASE_URL: z.string(),
    PORT: z.string(),
    ALPHABET: z.string().default('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
})