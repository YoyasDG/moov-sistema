import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, StudentStatus, EnrollmentStatus, PaymentConcept, PaymentStatus, PaymentMethod, AccountType, ExpenseCategory, NotificationAudience, NotificationStatus, NotificationType, Prisma } from "@prisma/client";
import { addDays, addMonths, subDays } from "date-fns";

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
});

async function main() {
  await prisma.ledgerEntry.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.group.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Moov2026!", 10);

  const [admin, teacher, tutor] = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@moovstudio.com",
        passwordHash,
        fullName: "Andrea Morales",
        phone: "555-0101",
        role: Role.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: "maestra@moovstudio.com",
        passwordHash,
        fullName: "Camila Rojas",
        phone: "555-0102",
        role: Role.TEACHER,
      },
    }),
    prisma.user.create({
      data: {
        email: "mama@moovstudio.com",
        passwordHash,
        fullName: "Laura Herrera",
        phone: "555-0103",
        role: Role.TUTOR,
      },
    }),
  ]);

  const accounts = await Promise.all([
    prisma.account.create({
      data: { type: AccountType.CASH, name: "Caja", description: "Flujo diario del estudio" },
    }),
    prisma.account.create({
      data: { type: AccountType.BANK_1, name: "Cuenta bancaria 1", description: "Cuenta principal" },
    }),
    prisma.account.create({
      data: { type: AccountType.BANK_2, name: "Cuenta bancaria 2", description: "Cuenta alterna" },
    }),
  ]);

  const silks = await prisma.group.create({
    data: {
      name: "Aerial Silks Kids",
      schedule: "Lun y Mié · 17:00 - 18:00",
      monthlyFee: new Prisma.Decimal(1800),
      discountedMonthlyFee: new Prisma.Decimal(1600),
      capacity: 14,
      description: "Grupo intermedio con enfoque técnico y fuerza.",
      teacherId: teacher.id,
    },
  });

  const hoops = await prisma.group.create({
    data: {
      name: "Lyra Teens",
      schedule: "Mar y Jue · 18:30 - 19:30",
      monthlyFee: new Prisma.Decimal(1900),
      discountedMonthlyFee: new Prisma.Decimal(1700),
      capacity: 12,
      description: "Grupo para adolescentes con entrenamiento escénico.",
      teacherId: teacher.id,
    },
  });

  const [alma, sofia, regina] = await Promise.all([
    prisma.student.create({
      data: {
        fullName: "Alma Herrera",
        birthDate: new Date("2014-03-08"),
        tutorName: "Laura Herrera",
        phone: "555-1111",
        email: "alma@example.com",
        allergies: "Ninguna",
        injuries: "Sensibilidad lumbar ocasional",
        notes: "Ama los splits y secuencias de piso.",
        status: StudentStatus.ACTIVE,
        groupId: silks.id,
        primaryTutorId: tutor.id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Sofía Luna",
        birthDate: new Date("2012-11-19"),
        tutorName: "Mariana Luna",
        phone: "555-2222",
        email: "sofia@example.com",
        allergies: "Polen",
        notes: "Requiere seguimiento de flexibilidad de hombro.",
        status: StudentStatus.ACTIVE,
        groupId: silks.id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Regina Cruz",
        birthDate: new Date("2010-07-02"),
        tutorName: "Paola Cruz",
        phone: "555-3333",
        email: "regina@example.com",
        injuries: "Recuperación de tobillo derecho",
        status: StudentStatus.INACTIVE,
        groupId: hoops.id,
      },
    }),
  ]);

  const [almaEnrollment, sofiaEnrollment] = await Promise.all([
    prisma.enrollment.create({
      data: {
        studentId: alma.id,
        groupId: silks.id,
        startDate: new Date("2025-08-01"),
        expiresAt: new Date("2026-08-01"),
        status: EnrollmentStatus.ACTIVE,
      },
    }),
    prisma.enrollment.create({
      data: {
        studentId: sofia.id,
        groupId: silks.id,
        startDate: new Date("2025-09-01"),
        expiresAt: addDays(new Date(), 22),
        status: EnrollmentStatus.PENDING_RENEWAL,
      },
    }),
  ]);

  await prisma.enrollment.create({
    data: {
      studentId: regina.id,
      groupId: hoops.id,
      startDate: new Date("2024-05-10"),
      expiresAt: subDays(new Date(), 20),
      status: EnrollmentStatus.EXPIRED,
    },
  });

  const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const nextMonthDate = addMonths(new Date(), 1);
  const nextMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, "0")}`;

  const paymentData = [
    {
      studentId: alma.id,
      enrollmentId: almaEnrollment.id,
      concept: PaymentConcept.MONTHLY,
      monthKey: thisMonth,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      discountDeadline: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
      baseAmount: new Prisma.Decimal(1800),
      discountedAmount: new Prisma.Decimal(1600),
      amountPaid: new Prisma.Decimal(1600),
      paidAt: new Date(),
      method: PaymentMethod.BANK_TRANSFER_1,
      status: PaymentStatus.PAID,
      accountId: accounts[1].id,
      verifiedById: admin.id,
      notes: "Pago capturado desde portal",
    },
    {
      studentId: sofia.id,
      enrollmentId: sofiaEnrollment.id,
      concept: PaymentConcept.MONTHLY,
      monthKey: thisMonth,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      discountDeadline: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
      baseAmount: new Prisma.Decimal(1800),
      discountedAmount: new Prisma.Decimal(1600),
      status: PaymentStatus.OVERDUE,
      notes: "Se envió recordatorio automático",
    },
    {
      studentId: alma.id,
      enrollmentId: almaEnrollment.id,
      concept: PaymentConcept.MONTHLY,
      monthKey: nextMonth,
      dueDate: new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), 1),
      discountDeadline: new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), 5),
      baseAmount: new Prisma.Decimal(1800),
      discountedAmount: new Prisma.Decimal(1600),
      status: PaymentStatus.PENDING,
    },
    {
      studentId: sofia.id,
      enrollmentId: sofiaEnrollment.id,
      concept: PaymentConcept.RE_ENROLLMENT,
      monthKey: `${new Date().getFullYear()}`,
      dueDate: addDays(new Date(), 20),
      discountDeadline: addDays(new Date(), 5),
      baseAmount: new Prisma.Decimal(900),
      discountedAmount: new Prisma.Decimal(900),
      status: PaymentStatus.PENDING,
    },
  ];

  const createdPayments = [];

  for (const payment of paymentData) {
    const created = await prisma.payment.create({ data: payment });
    createdPayments.push(created);
  }

  await prisma.ledgerEntry.create({
    data: {
      accountId: accounts[1].id,
      paymentId: createdPayments[0].id,
      type: "PAYMENT",
      amount: createdPayments[0].amountPaid ?? new Prisma.Decimal(0),
      description: `Pago mensual ${alma.fullName}`,
      date: createdPayments[0].paidAt ?? new Date(),
    },
  });

  const expense = await prisma.expense.create({
    data: {
      accountId: accounts[0].id,
      createdById: admin.id,
      amount: new Prisma.Decimal(12500),
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
      category: ExpenseCategory.RENT,
      description: "Renta del estudio",
      invoiced: true,
    },
  });

  await prisma.ledgerEntry.create({
    data: {
      accountId: accounts[0].id,
      expenseId: expense.id,
      type: "EXPENSE",
      amount: new Prisma.Decimal(-12500),
      description: expense.description,
      date: expense.date,
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        createdById: admin.id,
        title: "Mensualidad vencida",
        message: "Sofía Luna tiene mensualidad vencida y saldo pendiente.",
        type: NotificationType.PAYMENT_REMINDER,
        audience: NotificationAudience.ADMIN,
        status: NotificationStatus.SENT,
        sendAt: new Date(),
      },
      {
        createdById: admin.id,
        title: "Reinscripción próxima",
        message: "La inscripción de Sofía Luna vence en menos de 30 días.",
        type: NotificationType.ENROLLMENT_EXPIRING,
        audience: NotificationAudience.ALL,
        status: NotificationStatus.SENT,
        sendAt: new Date(),
      },
      {
        createdById: teacher.id,
        title: "Clase abierta",
        message: "Este viernes habrá muestra abierta para mamás y tutores.",
        type: NotificationType.ANNOUNCEMENT,
        audience: NotificationAudience.TUTOR,
        status: NotificationStatus.SENT,
        sendAt: new Date(),
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
