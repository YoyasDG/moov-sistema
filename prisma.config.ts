// Load local .env when available, but don't crash if `dotenv` isn't installed
// (Vercel / production provides env vars directly).
if (process.env.NODE_ENV !== "production") {
  // dynamic import is non-blocking and will be ignored if the module is absent
  import("dotenv/config").catch(() => {});
}

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
