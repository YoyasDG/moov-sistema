import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { requireApiRole } from "@/lib/auth/api";
import { randomUUID } from "crypto";
import { hashPassword } from "@/lib/auth/server";
import { sendInvitationEmail, invitationEmailHtml } from "@/lib/email";

const INVITE_EXPIRY_HOURS = Number(process.env.INVITE_EXPIRY_HOURS ?? 72);

export async function POST(request: Request) {
  const auth = await requireApiRole(["ADMIN"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const { id } = body;
  if (!id) return jsonError("Missing id", 400);

  const invite = await prisma.invitation.findUnique({ where: { id } });
  if (!invite) return jsonError("Invitación no encontrada", 404);
  if (invite.used) return jsonError("Invitación ya utilizada", 400);

  const token = randomUUID() + "-" + Date.now().toString(36);
  const tokenHash = await hashPassword(token);
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 3600 * 1000);

  await prisma.invitation.update({ where: { id }, data: { tokenHash, expiresAt } });

  const link = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/accept-invite?token=${encodeURIComponent(token)}&email=${encodeURIComponent(invite.email)}`;
  const html = invitationEmailHtml(link, expiresAt);
  try {
    await sendInvitationEmail(invite.email, "Invitación a Moov (reenvío)", html);
  } catch (err: any) {
    console.error("Failed to resend invitation", err);
    return jsonError(err?.message ?? "Failed to send invitation", 502);
  }

  return jsonOk({ ok: true });
}
