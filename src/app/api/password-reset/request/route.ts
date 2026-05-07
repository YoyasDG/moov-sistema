import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { randomUUID } from "crypto";
import { hashPassword } from "@/lib/auth/server";
import { sendInvitationEmail } from "@/lib/email";

const RESET_EXPIRY_HOURS = Number(process.env.PASSWORD_RESET_EXPIRY_HOURS ?? 2);

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) return jsonError("Email requerido.");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return jsonOk({}); // avoid revealing

  const token = randomUUID() + "-" + Date.now().toString(36);
  const tokenHash = await hashPassword(token);
  const expiresAt = new Date(Date.now() + RESET_EXPIRY_HOURS * 3600 * 1000);

  await prisma.passwordReset.create({ data: { userId: user.id, tokenHash, expiresAt } });

  const link = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  await sendInvitationEmail(email, "Restablecer contraseña - Moov", `<p>Usa el siguiente enlace para restablecer tu contraseña: <a href="${link}">Restablecer contraseña</a></p>`);

  return jsonOk({});
}
