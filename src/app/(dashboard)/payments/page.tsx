import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatMonthLabel, paymentAmountForDate } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { PaymentActionDialog } from "@/components/payments/payment-action-dialog";

export default async function PaymentsPage() {
  const [payments, accounts] = await Promise.all([
    prisma.payment.findMany({
      where: { deletedAt: null },
      include: { student: true, account: true },
      orderBy: [{ status: "asc" }, { dueDate: "desc" }],
      take: 24,
    }),
    prisma.account.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Cobranza" title="Pagos" description="Mensualidades, reinscripciones y pagos manuales con impacto en caja y bancos." />
      <div className="space-y-4">
        {payments.map((payment) => {
          const suggestedAmount = paymentAmountForDate(
            payment.dueDate,
            payment.discountDeadline,
            payment.discountedAmount,
            payment.baseAmount,
          );

          return (
            <Card key={payment.id}>
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{payment.student.fullName}</p>
                    <Badge
                      variant={
                        payment.status === "PAID"
                          ? "success"
                          : payment.status === "OVERDUE"
                            ? "danger"
                            : payment.status === "UNDER_REVIEW"
                              ? "warning"
                              : "default"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {payment.concept} · {formatMonthLabel(payment.monthKey)} · vence {formatDate(payment.dueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{formatCurrency(payment.amountPaid ?? suggestedAmount)}</p>
                  <p className="text-sm text-muted-foreground">{payment.account?.name ?? "Sin cuenta"}</p>
                </div>
                {payment.status !== "PAID" ? (
                  <PaymentActionDialog paymentId={payment.id} suggestedAmount={suggestedAmount} accounts={accounts} />
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
