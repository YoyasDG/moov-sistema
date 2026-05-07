import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { requireApiRole } from "@/lib/auth/api";

export async function POST(request: Request) {
  const auth = await requireApiRole(["ADMIN"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const { id } = body;
  if (!id) return jsonError("Missing id", 400);

  const invite = await prisma.invitation.findUnique({ where: { id } });
  if (!invite) return jsonError("Invitación no encontrada", 404);

  await prisma.invitation.update({ where: { id }, data: { used: true } });

  return jsonOk({ ok: true });
}
