import "server-only";

import { addDays, endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { prisma } from "@/lib/prisma";
import { currentMonthIncome, generateMonthlyPayments, refreshOverduePayments, toNumber } from "@/lib/services/payments";

export async function getDashboardSnapshot() {
  await generateMonthlyPayments();
  await refreshOverduePayments();

  const [pendingMonthly, expiringEnrollments, activeStudents, recentPayments, accounts, recentAlerts] =
    await Promise.all([
      prisma.payment.count({
        where: {
          concept: "MONTHLY",
          status: { in: ["PENDING", "OVERDUE"] },
          deletedAt: null,
        },
      }),
      prisma.enrollment.findMany({
        where: {
          deletedAt: null,
          expiresAt: {
            lte: addDays(new Date(), 30),
          },
          status: { in: ["ACTIVE", "PENDING_RENEWAL"] },
        },
        include: {
          student: true,
          group: true,
        },
        orderBy: { expiresAt: "asc" },
        take: 5,
      }),
      prisma.student.count({
        where: {
          status: "ACTIVE",
          deletedAt: null,
        },
      }),
      prisma.payment.findMany({
        where: {
          status: "PAID",
          deletedAt: null,
        },
        include: {
          student: true,
          account: true,
        },
        orderBy: { paidAt: "desc" },
        take: 6,
      }),
      prisma.account.findMany({
        include: {
          ledgerEntries: true,
        },
      }),
      prisma.notification.findMany({
        where: {
          status: "SENT",
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

  const income = await currentMonthIncome();

  const chart = [];

  for (let i = 5; i >= 0; i -= 1) {
    const reference = subMonths(new Date(), i);
    const start = startOfMonth(reference);
    const end = endOfMonth(reference);
    const monthIncome = await prisma.payment.aggregate({
      _sum: { amountPaid: true },
      where: {
        status: "PAID",
        paidAt: {
          gte: start,
          lte: end,
        },
        deletedAt: null,
      },
    });

    chart.push({
      month: format(reference, "MMM"),
      ingresos: toNumber(monthIncome._sum.amountPaid),
    });
  }

  const balances = accounts.map((account) => ({
    id: account.id,
    name: account.name,
    type: account.type,
    balance: account.ledgerEntries.reduce((sum, item) => sum + toNumber(item.amount), 0),
  }));

  return {
    cards: {
      pendingMonthly,
      expiringCount: expiringEnrollments.length,
      income,
      activeStudents,
    },
    recentPayments,
    expiringEnrollments,
    accountBalances: balances,
    recentAlerts,
    incomeChart: chart,
  };
}
