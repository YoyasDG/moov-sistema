import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { formatDate } from "@/lib/format";

export default async function EnrollmentsPage({ searchParams }: { searchParams?: { filter?: string } }) {
  const filter = searchParams?.filter;
  const whereBase: any = { deletedAt: null };

  if (filter === "expiring") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 30);
    whereBase.expiresAt = { lte: cutoff };
  }

  const enrollments = await prisma.enrollment.findMany({
    where: whereBase,
    include: { student: true, group: true },
    orderBy: { expiresAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Renovaciones" title="Inscripciones" description="Detecta vencimientos, reinscripciones y estatus anual de cada alumna." />
      <div className="grid gap-4">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id}>
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{enrollment.student.fullName}</p>
                <p className="text-sm text-muted-foreground">{enrollment.group.name}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Inicio: {formatDate(enrollment.startDate)}</p>
                <p>Vence: {formatDate(enrollment.expiresAt)}</p>
              </div>
              <Badge variant={enrollment.status === "ACTIVE" ? "success" : enrollment.status === "PENDING_RENEWAL" ? "warning" : "danger"}>
                {enrollment.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
