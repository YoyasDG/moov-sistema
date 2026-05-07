import { env } from "@/lib/env";

const RESEND_API_KEY = env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM ?? `no-reply@${new URL(env.APP_URL).hostname}`;

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured — skipping email");
    return;
  }
  const res = await fetch("https://api.resend.com/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    let body: any = null;
    try {
      body = await res.json();
    } catch (e) {
      try {
        body = await res.text();
      } catch (e2) {
        body = String(e2);
      }
    }

    // Log detailed info for server logs (Vercel) to diagnose 4xx/5xx errors
    console.error("Resend API error", { status: res.status, statusText: res.statusText, body });
    throw new Error(`Resend API error: ${res.status} ${res.statusText}`);
  }
}

export async function sendInvitationEmail(to: string, subject: string, html: string) {
  await sendEmail(to, subject, html);
}

export async function sendResetEmail(to: string, subject: string, html: string) {
  await sendEmail(to, subject, html);
}

export function invitationEmailHtml(inviteLink: string, expiresAt: Date, name?: string) {
  return `
    <div style="font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial; color:#14121a; padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;box-shadow:0 8px 24px rgba(16,16,24,0.06);">
        <h1 style="color:#673397;margin:0 0 8px;font-size:20px">Bienvenida a Moov</h1>
        <p style="color:#6b6672;margin:0 0 18px">Hola ${name ?? ""}, te hemos enviado una invitación para activar tu cuenta en Moov Aerial Studio.</p>
        <div style="text-align:center;margin:18px 0;">
          <a href="${inviteLink}" style="background:#673397;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none;display:inline-block;font-weight:600">Aceptar invitación</a>
        </div>
        <p style="color:#6b6672;font-size:13px;margin:8px 0">Este enlace expira el ${expiresAt.toLocaleString()}.</p>
        <p style="color:#a09aa6;font-size:13px;margin-top:12px">Si no esperabas esta invitación, puedes ignorar este correo. Si necesitas ayuda, contáctanos en ${FROM_EMAIL}.</p>
      </div>
    </div>
  `;
}

export function resetEmailHtml(link: string, expiresAt: Date) {
  return `
    <div style="font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial; color:#14121a; padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;box-shadow:0 8px 24px rgba(16,16,24,0.06);">
        <h1 style="color:#673397;margin:0 0 8px;font-size:20px">Restablecer contraseña</h1>
        <p style="color:#6b6672;margin:0 0 18px">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
        <div style="text-align:center;margin:18px 0;">
          <a href="${link}" style="background:#673397;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none;display:inline-block;font-weight:600">Restablecer contraseña</a>
        </div>
        <p style="color:#6b6672;font-size:13px;margin:8px 0">Este enlace expira el ${expiresAt.toLocaleString()}.</p>
        <p style="color:#a09aa6;font-size:13px;margin-top:12px">Si no solicitaste esto, puedes ignorar este correo. Para ayuda, responde a este mensaje.</p>
      </div>
    </div>
  `;
}

