import { prisma } from "@/lib/prisma";
import { InviteForm } from "@/components/admin/invite-form";
import { UsersTable } from "@/components/admin/users-table";
import { requireRole } from "@/lib/auth/dal";

export default async function AdminUsersPage() {
  const session = await requireRole(["ADMIN"]);

  const usersRaw = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true } });
  const invitesRaw = await prisma.invitation.findMany({ orderBy: { createdAt: "desc" } });

  // Serialize Dates to plain strings for Client Components
  const users = usersRaw.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));
  const invites = invitesRaw.map((i) => ({ ...i, createdAt: i.createdAt.toISOString(), expiresAt: i.expiresAt.toISOString() }));

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
          <UsersTable users={users} invites={invites} />
        </div>
      </div>
    </div>
  );
}
