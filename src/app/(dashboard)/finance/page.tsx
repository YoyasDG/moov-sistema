import { getFinanceSnapshot } from "@/lib/services/finance";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseForm } from "@/components/forms/expense-form";
import { SectionHeader } from "@/components/section-header";

export default async function FinancePage() {
  const finance = await getFinanceSnapshot();

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Tesorería" title="Finanzas y proyección" description="Balance por cuenta, gastos, ingresos esperados y rentabilidad estimada." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Gastos fijos mensuales</p><p className="mt-2 text-3xl font-semibold">{formatCurrency(finance.projection.fixedExpenses)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Ingresos esperados</p><p className="mt-2 text-3xl font-semibold">{formatCurrency(finance.projection.expectedIncome)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Balance proyectado</p><p className="mt-2 text-3xl font-semibold">{formatCurrency(finance.projection.projectedBalance)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Rentabilidad</p><p className="mt-2 text-3xl font-semibold">{finance.projection.profitability}%</p></CardContent></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Balances por cuenta</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {finance.balances.map((account) => (
                <div key={account.id} className="rounded-3xl bg-muted/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{account.name}</p>
                    <p className="font-semibold">{formatCurrency(account.balance)}</p>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {account.movements.map((movement) => (
                      <div key={movement.id} className="flex items-center justify-between">
                        <span>{movement.description}</span>
                        <span>{formatCurrency(movement.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Gastos recientes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {finance.expenses.map((expense) => (
                <div key={expense.id} className="rounded-3xl bg-muted/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{expense.description}</p>
                    <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{expense.account.name} · {expense.category} · {formatDate(expense.date)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Registrar gasto</CardTitle></CardHeader>
          <CardContent>
            <ExpenseForm accounts={finance.balances.map((account) => ({ id: account.id, name: account.name }))} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
