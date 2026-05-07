import { prisma } from "@/lib/prisma";
import { InviteForm } from "@/components/admin/invite-form";
import { UsersTable } from "@/components/admin/users-table";
import { requireRole } from "@/lib/auth/dal";
import { Prisma } from "@prisma/client";

export default async function AdminUsersPage() {
  const session = await requireRole(["ADMIN"]);

  let users = [] as any[];
  let invites = [] as any[];
  let dbError: string | null = null;

  try {
    const usersRaw = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true } });
    const invitesRaw = await prisma.invitation.findMany({ orderBy: { createdAt: "desc" } });

    // Serialize Dates to plain strings for Client Components
    users = usersRaw.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));
    invites = invitesRaw.map((i) => ({ ...i, createdAt: i.createdAt.toISOString(), expiresAt: i.expiresAt.toISOString() }));
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2021") {
      dbError = `Database migration missing: ${err.meta?.modelName ?? "unknown"} table not found.`;
    } else {
      dbError = err?.message ?? String(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl">Usuarios e invitaciones</h2>
        <p className="text-muted-foreground">Gestiona cuentas, invitaciones y estado de activación.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface-panel rounded-lg p-6">
          <h3 className="font-medium mb-4">Enviar invitación</h3>
          <InviteForm />
        </div>

        <div className="surface-panel rounded-lg p-6">
          <h3 className="font-medium mb-4">Invitaciones recientes</h3>
          {dbError ? (
            <div className="rounded-md border border-danger/20 bg-danger/6 p-4">
              <p className="font-medium">No se pudo cargar invitaciones</p>
              <p className="text-sm text-muted-foreground mt-2">{dbError}</p>
              <p className="text-sm mt-2">Solución: ejecuta las migraciones en la base de datos de producción (por ejemplo, `npx prisma migrate deploy`).</p>
            </div>
          ) : (
            <UsersTable users={users} invites={invites} />
          )}
        </div>
      </div>
    </div>
  );
}
