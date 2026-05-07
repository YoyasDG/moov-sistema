import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { comparePassword, hashPassword } from "@/lib/auth/server";

export async function POST(request: Request) {
  const { token, email, password } = await request.json();
  if (!token || !email || !password) return jsonError("Datos incompletos.");

  const reset = await prisma.passwordReset.findFirst({ where: { user: { email }, used: false }, orderBy: { createdAt: "desc" } });
  if (!reset) return jsonError("Token inválido.", 404);
  if (reset.expiresAt < new Date()) return jsonError("Token expirado.", 400);

  const ok = await comparePassword(token, reset.tokenHash);
  if (!ok) return jsonError("Token inválido.", 400);

  const passwordHash = await hashPassword(password);
  await prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } });
  await prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } });

  return jsonOk({});
}
