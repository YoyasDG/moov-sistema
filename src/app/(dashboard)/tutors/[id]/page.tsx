import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/section-header";
import { TutorForm } from "@/components/forms/tutor-form";
import { TutorActions, UnlinkStudentButton } from "@/components/tutor-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function TutorDetailPage({ params }: { params: { id: string } }) {
  const tutor = await prisma.user.findUnique({ where: { id: params.id }, select: { id: true, fullName: true, email: true, phone: true, isActive: true } });
  if (!tutor) return <div>Tutor no encontrado.</div>;

  const students = await prisma.student.findMany({ where: { primaryTutorId: tutor.id, deletedAt: null }, orderBy: { fullName: "asc" } });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Tutor" title={tutor.fullName} description={tutor.email} actions={<TutorActions tutorId={tutor.id} />} />

      <Card>
        <CardHeader>
          <CardTitle>Detalles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Correo</p>
              <p className="font-medium">{tutor.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">{tutor.phone ?? "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Editar</p>
              <TutorForm mode="update" tutor={{ id: tutor.id, fullName: tutor.fullName, email: tutor.email, phone: tutor.phone, portalEnabled: tutor.isActive }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alumnas vinculadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.fullName}</TableCell>
                  <TableCell>{s.groupId ?? "-"}</TableCell>
                  <TableCell>
                    <UnlinkStudentButton studentId={s.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
