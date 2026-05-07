import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { comparePassword, hashPassword } from "@/lib/auth/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { token, email, password, fullName } = body;
  if (!token || !email || !password || !fullName) return jsonError("Datos incompletos.");

  const invite = await prisma.invitation.findFirst({ where: { email, used: false }, orderBy: { createdAt: "desc" } });
  if (!invite) return jsonError("Invitación inválida.", 404);
  if (invite.expiresAt < new Date()) return jsonError("Invitación expirada.", 400);

  const ok = await comparePassword(token, invite.tokenHash);
  if (!ok) return jsonError("Token inválido.", 400);

  // create user
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash, fullName, role: invite.role, isActive: true } });

  await prisma.invitation.update({ where: { id: invite.id }, data: { used: true } });

  return jsonOk({ id: user.id }, 201);
}
