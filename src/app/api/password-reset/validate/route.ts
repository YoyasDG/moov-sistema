import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { comparePassword } from "@/lib/auth/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");
  if (!token || !email) return jsonError("Invalid", 400);

  const reset = await prisma.passwordReset.findFirst({ where: { user: { email }, used: false }, orderBy: { createdAt: "desc" } });
  if (!reset) return jsonError("invalid", 404);
  if (reset.expiresAt < new Date()) return jsonError("expired", 410);

  const ok = await comparePassword(token, reset.tokenHash);
  if (!ok) return jsonError("invalid", 400);

  return jsonOk({ ok: true });
}
