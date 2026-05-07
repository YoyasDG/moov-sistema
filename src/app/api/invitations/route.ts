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
  const { email, role } = body;
  if (!email || !role) return jsonError("Email y rol requeridos.");

  // create token and hash
  const token = randomUUID() + "-" + Date.now().toString(36);
  const tokenHash = await hashPassword(token);
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 3600 * 1000);

  const invite = await prisma.invitation.create({ data: { email, role, tokenHash, expiresAt, invitedById: auth.session.id } });

  const link = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/accept-invite?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const html = invitationEmailHtml(link, expiresAt);
  await sendInvitationEmail(email, "Invitación a Moov", html);

  return jsonOk({ id: invite.id }, 201);
}
