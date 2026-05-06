import "server-only";

import { endOfMonth, startOfMonth } from "date-fns";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/services/payments";

export async function getFinanceSnapshot() {
  const [accounts, expenses, pendingPayments, groups] = await Promise.all([
    prisma.account.findMany({
      include: {
        ledgerEntries: {
          orderBy: { date: "desc" },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.expense.findMany({
      where: { deletedAt: null },
      include: { account: true },
      orderBy: { date: "desc" },
      take: 8,
    }),
    prisma.payment.findMany({
      where: {
        status: { in: ["PENDING", "OVERDUE"] },
        concept: "MONTHLY",
        deletedAt: null,
      },
      include: { student: true },
    }),
    prisma.group.findMany({
      where: { deletedAt: null },
    }),
  ]);

  const monthlyExpensesAggregate = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      date: {
        gte: startOfMonth(new Date()),
        lte: endOfMonth(new Date()),
      },
      deletedAt: null,
    },
  });

  const expectedIncome = pendingPayments.reduce((sum, payment) => sum + toNumber(payment.discountedAmount), 0);
  const fixedExpenses = toNumber(monthlyExpensesAggregate._sum.amount);

  return {
    balances: accounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.ledgerEntries.reduce((sum, entry) => sum + toNumber(entry.amount), 0),
      movements: account.ledgerEntries.slice(0, 4),
    })),
    expenses,
    projection: {
      fixedExpenses,
      expectedIncome,
      projectedBalance: expectedIncome - fixedExpenses,
      profitability:
        expectedIncome > 0 ? Number((((expectedIncome - fixedExpenses) / expectedIncome) * 100).toFixed(1)) : 0,
    },
    avgCapacity: groups.length
      ? Math.round(
          (groups.reduce((sum, group) => sum + group.capacity, 0) / groups.length) *
            10,
        ) / 10
      : 0,
  };
}
