import { jsonError, jsonOk } from "@/lib/http";
import { requireApiRole } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: RouteContext<"/api/students/[id]/unlink">) {
  const auth = await requireApiRole(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;

  const { id } = context.params;
  await prisma.student.update({ where: { id }, data: { primaryTutorId: null } });
  return jsonOk({});
}
