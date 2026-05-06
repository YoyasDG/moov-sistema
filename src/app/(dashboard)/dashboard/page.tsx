import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/section-header";
import { StatsCard } from "@/components/stats-card";
import { IncomeChart } from "@/components/charts/income-chart";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatMonthLabel } from "@/lib/format";
import { getDashboardSnapshot } from "@/lib/services/dashboard";

export default async function DashboardPage() {
  const dashboard = await getDashboardSnapshot();

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Vista general"
        title="Operacion diaria del estudio"
        description="Cobranza, renovaciones y salud financiera en un tablero con presencia editorial y lectura rapida."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Mensualidades pendientes" value={String(dashboard.cards.pendingMonthly)} helper="Incluye pagos pendientes y vencidos" />
        <StatsCard label="Inscripciones por vencer" value={String(dashboard.cards.expiringCount)} helper="Proximos 30 dias" />
        <StatsCard label="Ingresos del mes" value={formatCurrency(dashboard.cards.income)} helper="Cobranza ya aplicada a cuentas" />
        <StatsCard label="Alumnas activas" value={String(dashboard.cards.activeStudents)} helper="Base activa actual" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <p className="font-subtitle text-lg text-primary">Pulso financiero</p>
            <CardTitle>Grafica mensual de ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeChart data={dashboard.incomeChart} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="font-subtitle text-lg text-primary">Distribucion</p>
            <CardTitle>Balances por cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.accountBalances.map((account) => (
              <div key={account.id} className="rounded-[1.6rem] border border-primary/10 bg-white/55 p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-white/72 dark:bg-white/4 dark:hover:bg-white/6">
                <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">{account.name}</p>
                <p className="mt-3 font-heading text-4xl leading-none">{formatCurrency(account.balance)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <p className="font-subtitle text-lg text-primary">Actividad</p>
            <CardTitle>Pagos recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-[1.6rem] border border-primary/10 bg-white/55 px-5 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/16 dark:bg-white/4">
                <div>
                  <p className="font-medium">{payment.student.fullName}</p>
                  <p className="text-sm text-muted-foreground">{formatMonthLabel(payment.monthKey)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(payment.amountPaid ?? 0)}</p>
                  <p className="text-sm text-muted-foreground">{payment.account?.name ?? "Sin cuenta"}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="font-subtitle text-lg text-primary">Atencion inmediata</p>
            <CardTitle>Alertas activas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.expiringEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="rounded-[1.6rem] border border-primary/12 bg-white/58 p-5 transition duration-300 hover:-translate-y-0.5 dark:bg-white/4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">{enrollment.student.fullName}</p>
                  <Badge variant="warning">Vence pronto</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {enrollment.group.name} · {formatDate(enrollment.expiresAt)}
                </p>
              </div>
            ))}
            {dashboard.recentAlerts.map((alert) => (
              <div key={alert.id} className="rounded-[1.6rem] border border-dashed border-primary/12 bg-accent/38 p-5">
                <p className="font-medium">{alert.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
