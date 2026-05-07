import { NextResponse } from "next/server";
import { sendInvitationEmail, invitationEmailHtml } from "@/lib/email";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  // protect this endpoint: require debug key in header when in production
  const debugKey = process.env.DEBUG_EMAIL_KEY;
  const headerKey = request.headers.get("x-debug-key");

  if (process.env.NODE_ENV === "production" && (!debugKey || headerKey !== debugKey)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const email = body.email;
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const token = "debug-token" + Date.now();
  const link = `${process.env.NEXT_PUBLIC_SITE_URL ?? env.APP_URL}/accept-invite?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  const html = invitationEmailHtml(link, new Date(Date.now() + 1000 * 60 * 60));

  try {
    await sendInvitationEmail(email, "[Moov] Test invite", html);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
