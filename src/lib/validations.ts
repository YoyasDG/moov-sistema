import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Ingresa un correo válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export const studentSchema = z.object({
  fullName: z.string().min(3, "Nombre completo requerido."),
  birthDate: z.string(),
  tutorName: z.string().min(3, "Nombre de tutor requerido."),
  phone: z.string().min(8, "Teléfono requerido."),
  email: z.email("Correo inválido."),
  allergies: z.string().optional().nullable(),
  injuries: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  groupId: z.string().optional().nullable(),
  primaryTutorId: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const groupSchema = z.object({
  name: z.string().min(3),
  schedule: z.string().min(3),
  monthlyFee: z.number().positive(),
  discountedMonthlyFee: z.number().positive().optional(),
  capacity: z.number().int().positive(),
  description: z.string().optional().nullable(),
  teacherId: z.string().optional().nullable(),
});

export const paymentUpdateSchema = z.object({
  status: z.enum(["PAID", "PENDING", "OVERDUE", "UNDER_REVIEW"]),
  method: z.enum(["CASH", "BANK_TRANSFER_1", "BANK_TRANSFER_2", "CARD", "UPLOAD_PROOF"]).optional().nullable(),
  accountId: z.string().optional().nullable(),
  amountPaid: z.number().nonnegative().optional(),
  notes: z.string().optional().nullable(),
});

export const expenseSchema = z.object({
  amount: z.number().positive(),
  date: z.string(),
  category: z.enum(["RENT", "MATERIAL", "SERVICES", "MARKETING", "OTHER"]),
  accountId: z.string(),
  description: z.string().min(3),
  invoiced: z.boolean(),
});
