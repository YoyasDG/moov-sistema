import { studentSchema } from "@/lib/validations";
import { jsonError, jsonOk } from "@/lib/http";
import { requireApiRole } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, context: RouteContext<"/api/students/[id]">) {
  const auth = await requireApiRole(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const body = await request.json();
  const parsed = studentSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos.");

  const student = await prisma.student.update({
    where: { id },
    data: {
      ...parsed.data,
      birthDate: new Date(parsed.data.birthDate),
      groupId: parsed.data.groupId || null,
      primaryTutorId: parsed.data.primaryTutorId || null,
    },
  });

  return jsonOk(student);
}
