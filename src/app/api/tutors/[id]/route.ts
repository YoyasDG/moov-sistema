import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { requireApiRole } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

const tutorUpdateSchema = z.object({
  fullName: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  portalEnabled: z.boolean().optional(),
});

export async function GET(request: Request, context: RouteContext<"/api/tutors/[id]">) {
  const { id } = context.params;
  const tutor = await prisma.user.findUnique({ where: { id }, select: { id: true, fullName: true, email: true, phone: true, isActive: true } });
  if (!tutor) return jsonError("Tutor no encontrado.", 404);
  return jsonOk(tutor);
}

export async function PUT(request: Request, context: RouteContext<"/api/tutors/[id]">) {
  const auth = await requireApiRole(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;

  const { id } = context.params;
  const body = await request.json();
  const parsed = tutorUpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos.");

  const data = parsed.data;

  const tutor = await prisma.user.update({
    where: { id },
    data: {
      fullName: data.fullName ?? undefined,
      email: data.email ?? undefined,
      phone: data.phone ?? undefined,
      isActive: data.portalEnabled ?? undefined,
    },
  });

  return jsonOk(tutor);
}

export async function DELETE(request: Request, context: RouteContext<"/api/tutors/[id]">) {
  const auth = await requireApiRole(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;

  const { id } = context.params;
  await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  return jsonOk({}, 204);
}
