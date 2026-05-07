import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { comparePassword } from "@/lib/auth/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");
  if (!token || !email) return jsonError("Invalid", 400);

  const invite = await prisma.invitation.findFirst({ where: { email, used: false }, orderBy: { createdAt: "desc" } });
  if (!invite) return jsonError("invalid", 404);
  if (invite.expiresAt < new Date()) return jsonError("expired", 410);

  const ok = await comparePassword(token, invite.tokenHash);
  if (!ok) return jsonError("invalid", 400);

  return jsonOk({ ok: true });
}
