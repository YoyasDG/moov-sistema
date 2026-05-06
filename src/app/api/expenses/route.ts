import { Prisma } from "@prisma/client";
import { expenseSchema } from "@/lib/validations";
import { jsonError, jsonOk } from "@/lib/http";
import { requireApiRole } from "@/lib/auth/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const auth = await requireApiRole(["ADMIN"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = expenseSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos.");

  const expense = await prisma.$transaction(async (tx) => {
    const created = await tx.expense.create({
      data: {
        amount: new Prisma.Decimal(parsed.data.amount),
        date: new Date(parsed.data.date),
        category: parsed.data.category,
        accountId: parsed.data.accountId,
        description: parsed.data.description,
        invoiced: parsed.data.invoiced,
        createdById: auth.session.id,
      },
    });

    await tx.ledgerEntry.create({
      data: {
        accountId: parsed.data.accountId,
        expenseId: created.id,
        type: "EXPENSE",
        amount: new Prisma.Decimal(-parsed.data.amount),
        description: parsed.data.description,
        date: new Date(parsed.data.date),
      },
    });

    return created;
  });

  return jsonOk(expense, 201);
}
