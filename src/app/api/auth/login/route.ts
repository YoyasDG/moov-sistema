import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { jsonError, jsonOk } from "@/lib/http";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user || !user.isActive) {
    return jsonError("Usuario o contraseña incorrectos.", 401);
  }

  const validPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);

  if (!validPassword) {
    return jsonError("Usuario o contraseña incorrectos.", 401);
  }

  await setSessionCookie({
    sub: user.id,
    role: user.role,
    email: user.email,
    fullName: user.fullName,
  });

  return jsonOk({
    success: true,
    redirectTo: user.role === "TUTOR" ? "/portal" : "/dashboard",
  });
}
