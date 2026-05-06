import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentForm } from "@/components/forms/student-form";
import { SectionHeader } from "@/components/section-header";
import { formatCurrency, formatDate, formatMonthLabel } from "@/lib/format";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [student, groups, tutors] = await Promise.all([
    prisma.student.findUnique({
      where: { id },
      include: {
        group: true,
        payments: {
          where: { deletedAt: null },
          orderBy: { dueDate: "desc" },
        },
        enrollments: {
          where: { deletedAt: null },
          orderBy: { expiresAt: "desc" },
        },
      },
    }),
    prisma.group.findMany({ where: { deletedAt: null }, select: { id: true, name: true } }),
    prisma.user.findMany({ where: { role: "TUTOR", deletedAt: null }, select: { id: true, fullName: true } }),
  ]);

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Vista detalle"
        title={student.fullName}
        description={`${student.group?.name ?? "Sin grupo"} · Tutor: ${student.tutorName}`}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Editar ficha</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentForm
              mode="update"
              student={{
                id: student.id,
                fullName: student.fullName,
                birthDate: student.birthDate.toISOString().slice(0, 10),
                tutorName: student.tutorName,
                phone: student.phone,
                email: student.email,
                allergies: student.allergies ?? "",
                injuries: student.injuries ?? "",
                notes: student.notes ?? "",
                groupId: student.groupId ?? undefined,
                primaryTutorId: student.primaryTutorId ?? undefined,
                status: student.status,
              }}
              groups={groups}
              tutors={tutors}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de pagos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.payments.map((payment) => (
                <div key={payment.id} className="rounded-3xl bg-muted/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{formatMonthLabel(payment.monthKey)}</p>
                    <p className="font-semibold">{formatCurrency(payment.amountPaid ?? payment.discountedAmount)}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{payment.status} · {formatDate(payment.dueDate)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inscripciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.enrollments.map((enrollment) => (
                <div key={enrollment.id} className="rounded-3xl bg-muted/60 p-4">
                  <p className="font-medium">{formatDate(enrollment.startDate)} → {formatDate(enrollment.expiresAt)}</p>
                  <p className="text-sm text-muted-foreground">{enrollment.status}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
