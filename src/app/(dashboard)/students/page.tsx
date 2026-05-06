import Link from "next/link";
import { Prisma, StudentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StudentForm } from "@/components/forms/student-form";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/section-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SearchParams = Promise<{ q?: string; status?: string; page?: string }>;

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const take = 8;
  const search = params.q ?? "";
  const status = params.status;
  const statusFilter =
    status === "ACTIVE" ? StudentStatus.ACTIVE : status === "INACTIVE" ? StudentStatus.INACTIVE : undefined;

  const where: Prisma.StudentWhereInput = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" as const } },
            { tutorName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  };

  const [students, total, groups, tutors] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        group: true,
        payments: {
          where: { deletedAt: null },
          orderBy: { dueDate: "desc" },
          take: 1,
        },
      },
      orderBy: { fullName: "asc" },
      skip: (page - 1) * take,
      take,
    }),
    prisma.student.count({ where }),
    prisma.group.findMany({ where: { deletedAt: null }, select: { id: true, name: true } }),
    prisma.user.findMany({ where: { role: "TUTOR", deletedAt: null }, select: { id: true, fullName: true } }),
  ]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="CRM del estudio"
        title="Alumnas"
        description="Busca, filtra y administra fichas completas con historial y grupo asignado."
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>Nueva alumna</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Registrar alumna</DialogTitle>
              </DialogHeader>
              <StudentForm mode="create" groups={groups} tutors={tutors} />
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Filtro rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-[1fr_180px_120px]">
            <Input name="q" defaultValue={search} placeholder="Buscar por alumna o tutor" />
            <select name="status" defaultValue={status ?? "ALL"} className="h-11 rounded-2xl border border-border bg-white/70 px-4 dark:bg-white/5">
              <option value="ALL">Todas</option>
              <option value="ACTIVE">Activas</option>
              <option value="INACTIVE">Baja</option>
            </select>
            <Button type="submit">Aplicar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto px-0 pb-0">
          {students.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alumna</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Estatus</TableHead>
                  <TableHead>Último pago</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{student.fullName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(student.birthDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell>{student.tutorName}</TableCell>
                    <TableCell>{student.group?.name ?? "Sin asignar"}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "ACTIVE" ? "success" : "muted"}>
                        {student.status === "ACTIVE" ? "Activa" : "Baja"}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.payments[0]?.monthKey ?? "Sin pagos"}</TableCell>
                    <TableCell>
                      <Link href={`/students/${student.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver detalle
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6">
              <EmptyState title="Sin alumnas en este filtro" description="Prueba otro término o registra una nueva alumna." />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>{total} alumnas registradas</p>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link href={`/students?page=${page - 1}&q=${search}&status=${status ?? "ALL"}`}>
              <Button variant="secondary" size="sm">Anterior</Button>
            </Link>
          ) : null}
          {page * take < total ? (
            <Link href={`/students?page=${page + 1}&q=${search}&status=${status ?? "ALL"}`}>
              <Button variant="secondary" size="sm">Siguiente</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
