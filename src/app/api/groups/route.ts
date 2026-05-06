import { groupSchema } from "@/lib/validations";
import { jsonError, jsonOk } from "@/lib/http";
import { requireApiRole } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const auth = await requireApiRole(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = groupSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos.");

  const group = await prisma.group.create({
    data: {
      ...parsed.data,
      teacherId: parsed.data.teacherId || null,
      description: parsed.data.description || null,
    },
  });

  return jsonOk(group, 201);
}
