import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { requireApiRole } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

const tutorSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  portalEnabled: z.boolean().optional(),
});

export async function GET() {
  const tutors = await prisma.user.findMany({ where: { role: "TUTOR", deletedAt: null }, select: { id: true, fullName: true, email: true, phone: true, isActive: true } });
  return jsonOk(tutors);
}

export async function POST(request: Request) {
  const auth = await requireApiRole(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = tutorSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos.");

  const data = parsed.data;

  const tutor = await prisma.user.create({
    data: {
      email: data.email,
      fullName: data.fullName,
      phone: data.phone || "",
      role: "TUTOR",
      isActive: data.portalEnabled ?? true,
      passwordHash: "",
    },
  });

  return jsonOk(tutor, 201);
}
