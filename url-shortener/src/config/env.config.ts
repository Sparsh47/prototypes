import { envSchema } from "../schema/env.schema.ts";

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    throw new Error("Invalid environment variables", parsedEnv.error);
}

export const env = parsedEnv.data;