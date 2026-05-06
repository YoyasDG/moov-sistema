import { getCurrentSession } from "@/lib/auth/dal";
import { getTutorPortalData } from "@/lib/services/portal";
import { formatCurrency, formatDate, formatMonthLabel } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PortalPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  const portal = await getTutorPortalData(session.id);

  return (
    <div className="space-y-6">
      {portal.students.map((student) => {
        const enrollment = student.enrollments[0];
        const pending = student.payments.filter((payment) => payment.status !== "PAID");

        return (
          <Card key={student.id}>
            <CardHeader>
              <CardTitle>{student.fullName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-3xl bg-muted/60 p-4">
                  <p className="text-sm text-muted-foreground">Grupo</p>
                  <p className="mt-1 font-semibold">{student.group?.name ?? "Sin grupo"}</p>
                </div>
                <div className="rounded-3xl bg-muted/60 p-4">
                  <p className="text-sm text-muted-foreground">Inscripción</p>
                  <p className="mt-1 font-semibold">{enrollment ? formatDate(enrollment.expiresAt) : "Sin registro"}</p>
                </div>
                <div className="rounded-3xl bg-muted/60 p-4">
                  <p className="text-sm text-muted-foreground">Saldo pendiente</p>
                  <p className="mt-1 font-semibold">{formatCurrency(pending.reduce((sum, payment) => sum + Number(payment.discountedAmount), 0))}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Historial de pagos</h3>
                {student.payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between rounded-3xl border border-border px-4 py-3">
                    <div>
                      <p className="font-medium">{formatMonthLabel(payment.monthKey)}</p>
                      <p className="text-sm text-muted-foreground">{payment.concept}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={payment.status === "PAID" ? "success" : payment.status === "OVERDUE" ? "danger" : "warning"}>
                        {payment.status}
                      </Badge>
                      <p className="mt-1 font-semibold">{formatCurrency(payment.amountPaid ?? payment.discountedAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardHeader><CardTitle>Avisos</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {portal.notifications.map((notification) => (
            <div key={notification.id} className="rounded-3xl bg-muted/60 p-4">
              <p className="font-medium">{notification.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
