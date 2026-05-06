import { prisma } from "@/lib/prisma";
import { GroupForm } from "@/components/forms/group-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/section-header";
import { formatCurrency } from "@/lib/format";

export default async function GroupsPage() {
  const [groups, teachers] = await Promise.all([
    prisma.group.findMany({
      where: { deletedAt: null },
      include: {
        students: {
          where: { deletedAt: null, status: "ACTIVE" },
        },
        teacher: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({ where: { role: "TEACHER", deletedAt: null }, select: { id: true, fullName: true } }),
  ]);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Planeación académica" title="Grupos" description="Controla capacidad, ocupación, costo y asignación por maestra." />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Crear grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupForm teachers={teachers} />
          </CardContent>
        </Card>
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">{group.schedule}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{group.teacher?.fullName ?? "Sin maestra asignada"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(group.monthlyFee)}</p>
                    <p className="text-sm text-muted-foreground">
                      {group.students.length}/{group.capacity} ocupación
                    </p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((group.students.length / group.capacity) * 100, 100)}%` }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
