import "server-only";

import { Prisma, PaymentConcept, PaymentStatus, type PaymentMethod } from "@prisma/client";
import { startOfMonth, endOfMonth, setDate } from "date-fns";
import { prisma } from "@/lib/prisma";
import { DISCOUNT_DEADLINE_DAY } from "@/lib/constants";
import { paymentAmountForDate } from "@/lib/format";

export function toNumber(value: Prisma.Decimal | number | string | null | undefined) {
  if (value == null) return 0;
  return Number(value);
}

export function monthKeyFor(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function generateMonthlyPayments(referenceDate = new Date()) {
  const monthStart = startOfMonth(referenceDate);
  const monthKey = monthKeyFor(referenceDate);
  const discountDeadline = setDate(new Date(monthStart), DISCOUNT_DEADLINE_DAY);

  const students = await prisma.student.findMany({
    where: {
      status: "ACTIVE",
      deletedAt: null,
      groupId: { not: null },
    },
    include: {
      group: true,
      enrollments: {
        where: { status: { in: ["ACTIVE", "PENDING_RENEWAL"] }, deletedAt: null },
        orderBy: { expiresAt: "desc" },
        take: 1,
      },
    },
  });

  let created = 0;

  for (const student of students) {
    if (!student.group) continue;

    const existing = await prisma.payment.findFirst({
      where: {
        studentId: student.id,
        concept: PaymentConcept.MONTHLY,
        monthKey,
      },
      select: { id: true },
    });

    if (existing) continue;

    await prisma.payment.create({
      data: {
        studentId: student.id,
        enrollmentId: student.enrollments[0]?.id,
        concept: PaymentConcept.MONTHLY,
        monthKey,
        dueDate: monthStart,
        discountDeadline,
        baseAmount: student.group.monthlyFee,
        discountedAmount: student.group.discountedMonthlyFee ?? student.group.monthlyFee,
        status: referenceDate.getDate() > DISCOUNT_DEADLINE_DAY ? PaymentStatus.OVERDUE : PaymentStatus.PENDING,
      },
    });

    created += 1;
  }

  return created;
}

export async function refreshOverduePayments(referenceDate = new Date()) {
  const overdueFrom = setDate(startOfMonth(referenceDate), DISCOUNT_DEADLINE_DAY + 1);

  await prisma.payment.updateMany({
    where: {
      concept: PaymentConcept.MONTHLY,
      status: PaymentStatus.PENDING,
      dueDate: { lte: overdueFrom },
      paidAt: null,
      deletedAt: null,
    },
    data: {
      status: PaymentStatus.OVERDUE,
    },
  });
}

export async function settlePayment(options: {
  paymentId: string;
  accountId: string;
  method: PaymentMethod;
  verifiedById: string;
  paidAt?: Date;
  amountPaid?: number;
  notes?: string | null;
}) {
  const payment = await prisma.payment.findUnique({
    where: { id: options.paymentId },
  });

  if (!payment) {
    throw new Error("Pago no encontrado.");
  }

  const paidAt = options.paidAt ?? new Date();
  const amountPaid =
    options.amountPaid ??
    paymentAmountForDate(
      payment.dueDate,
      payment.discountDeadline,
      payment.discountedAmount,
      payment.baseAmount,
      paidAt,
    );

  return prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: options.paymentId },
      data: {
        accountId: options.accountId,
        method: options.method,
        paidAt,
        amountPaid,
        status: PaymentStatus.PAID,
        verifiedById: options.verifiedById,
        notes: options.notes,
      },
    });

    const existingLedger = await tx.ledgerEntry.findUnique({
      where: { paymentId: options.paymentId },
    });

    if (existingLedger) {
      await tx.ledgerEntry.update({
        where: { paymentId: options.paymentId },
        data: {
          accountId: options.accountId,
          amount: amountPaid,
          date: paidAt,
          description: `Pago ${payment.concept.toLowerCase()} ${payment.monthKey ?? ""}`.trim(),
        },
      });
    } else {
      await tx.ledgerEntry.create({
        data: {
          accountId: options.accountId,
          paymentId: options.paymentId,
          type: "PAYMENT",
          amount: amountPaid,
          date: paidAt,
          description: `Pago ${payment.concept.toLowerCase()} ${payment.monthKey ?? ""}`.trim(),
        },
      });
    }

    return updatedPayment;
  });
}

export async function currentMonthIncome(date = new Date()) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const result = await prisma.payment.aggregate({
    _sum: {
      amountPaid: true,
    },
    where: {
      paidAt: {
        gte: start,
        lte: end,
      },
      status: PaymentStatus.PAID,
      deletedAt: null,
    },
  });

  return toNumber(result._sum.amountPaid);
}
