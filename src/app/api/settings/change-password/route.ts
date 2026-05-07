import { requireApiRole } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { comparePassword, hashPassword } from "@/lib/auth/server";

export async function POST(request: Request) {
  const auth = await requireApiRole(["ADMIN", "TEACHER", "TUTOR"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const { currentPassword, newPassword } = body;
  if (!currentPassword || !newPassword) return jsonError("Missing fields", 400);

  const user = await prisma.user.findUnique({ where: { id: auth.session.id } });
  if (!user) return jsonError("User not found", 404);

  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) return jsonError("Current password incorrect", 401);

  const newHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });

  return jsonOk({ ok: true });
}
