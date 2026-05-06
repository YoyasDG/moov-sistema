import { paymentUpdateSchema } from "@/lib/validations";
import { jsonError, jsonOk } from "@/lib/http";
import { requireApiRole } from "@/lib/auth/api";
import { settlePayment } from "@/lib/services/payments";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, context: RouteContext<"/api/payments/[id]">) {
  const auth = await requireApiRole(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const body = await request.json();
  const parsed = paymentUpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos.");

  if (parsed.data.status === "PAID" && parsed.data.accountId && parsed.data.method) {
    const payment = await settlePayment({
      paymentId: id,
      accountId: parsed.data.accountId,
      method: parsed.data.method,
      verifiedById: auth.session.id,
      amountPaid: parsed.data.amountPaid,
      notes: parsed.data.notes,
    });

    return jsonOk(payment);
  }

  const updated = await prisma.payment.update({
    where: { id },
    data: {
      status: parsed.data.status,
      notes: parsed.data.notes,
    },
  });

  return jsonOk(updated);
}
