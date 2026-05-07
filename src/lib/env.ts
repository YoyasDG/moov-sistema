import { z } from "zod";

// Provide a sensible default for APP_URL to make local builds and dev ergonomic.
if (!process.env.APP_URL) {
  process.env.APP_URL = "http://localhost:3000";
}

const base = {
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters for security"),
  APP_URL: z.string().url("APP_URL must be a valid URL"),
};

const envSchema = z.object({ ...base, RESEND_API_KEY: z.string().optional() });

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const first = _env.error.issues[0];
  throw new Error(`Environment validation error: ${first.path.join(".")}: ${first.message}`);
}

export const env = _env.data;
