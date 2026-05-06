import { studentSchema } from "@/lib/validations";
import { jsonError, jsonOk } from "@/lib/http";
import { requireApiRole } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const auth = await requireApiRole(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = studentSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos.");

  const student = await prisma.student.create({
    data: {
      ...parsed.data,
      birthDate: new Date(parsed.data.birthDate),
      groupId: parsed.data.groupId || null,
      primaryTutorId: parsed.data.primaryTutorId || null,
    },
  });

  return jsonOk(student, 201);
}
