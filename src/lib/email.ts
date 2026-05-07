const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM ?? "no-reply@moovstudio.com";

export async function sendInvitationEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured — skipping email");
    return;
  }

  await fetch("https://api.resend.com/email", {
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
}

export function invitationEmailHtml(inviteLink: string, expiresAt: Date, name?: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111;">
      <div style="max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#673397;margin-bottom:8px">Bienvenida a Moov</h2>
        <p style="color:#6b6672">Hola ${name ?? ""},</p>
        <p style="color:#6b6672">Has sido invitada a crear una cuenta en Moov Aerial Studio. Haz clic en el botón debajo para activar tu cuenta.</p>
        <div style="margin:24px 0;text-align:center">
          <a href="${inviteLink}" style="background:#673397;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;display:inline-block">Aceptar invitación</a>
        </div>
        <p style="color:#6b6672;font-size:13px">Este enlace expira el ${expiresAt.toLocaleString()}.</p>
        <p style="color:#a09aa6;font-size:13px">Si no esperabas esta invitación, ignora este correo.</p>
      </div>
    </div>
  `;
}
