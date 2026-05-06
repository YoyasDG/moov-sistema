import { format, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";

export function formatCurrency(amount: number | string | { toString(): string }) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function formatDate(value: Date | string) {
  return format(new Date(value), "d MMM yyyy", { locale: es });
}

export function formatMonthLabel(monthKey: string | null | undefined) {
  if (!monthKey) return "Sin periodo";

  const normalized = monthKey.trim();

  if (/^\d{4}-\d{2}$/.test(normalized)) {
    const [year, month] = normalized.split("-").map(Number);
    const date = new Date(year, month - 1, 1);

    if (!Number.isNaN(date.getTime())) {
      return format(date, "MMMM yyyy", { locale: es });
    }
  }

  if (/^\d{4}$/.test(normalized)) {
    return `Año ${normalized}`;
  }

  const parsedDate = new Date(normalized);

  if (!Number.isNaN(parsedDate.getTime())) {
    return format(parsedDate, "MMMM yyyy", { locale: es });
  }

  return normalized;
}

export function paymentAmountForDate(
  dueDate: Date | string,
  discountDeadline: Date | string,
  discountedAmount: number | string | { toString(): string },
  baseAmount: number | string | { toString(): string },
  referenceDate = new Date(),
) {
  const paymentDate = new Date(referenceDate);
  const discountDate = new Date(discountDeadline);
  const due = new Date(dueDate);

  if (isBefore(paymentDate, discountDate) || paymentDate.toDateString() === discountDate.toDateString()) {
    return Number(discountedAmount);
  }

  if (isAfter(paymentDate, due)) {
    return Number(baseAmount);
  }

  return Number(baseAmount);
}
