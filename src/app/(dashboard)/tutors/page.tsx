import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TutorForm } from "@/components/forms/tutor-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function TutorsPage() {
  const tutors = await prisma.user.findMany({ where: { role: "TUTOR", deletedAt: null }, orderBy: { fullName: "asc" } });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Personal" title="Tutores" description="Gestiona cuentas de tutores/encargadas y su acceso al portal." actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nuevo tutor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Crear tutor</DialogTitle>
            </DialogHeader>
            <TutorForm mode="create" />
          </DialogContent>
        </Dialog>
      } />

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.map((tutor) => (
                <TableRow key={tutor.id}>
                  <TableCell>{tutor.fullName}</TableCell>
                  <TableCell>{tutor.email}</TableCell>
                  <TableCell>{tutor.phone ?? "-"}</TableCell>
                  <TableCell>{tutor.isActive ? "Habilitado" : "Deshabilitado"}</TableCell>
                  <TableCell>
                    <Link href={`/tutors/${tutor.id}`}>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </Link>
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
