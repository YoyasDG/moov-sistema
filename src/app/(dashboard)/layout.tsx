import { requireRole } from "@/lib/auth/dal";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";

export const dynamic = "force-dynamic";

const roleLabels = {
  ADMIN: "Administración",
  TEACHER: "Maestra",
  TUTOR: "Tutor",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["ADMIN", "TEACHER"]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1800px] gap-6 px-4 py-4 md:px-6 lg:px-8">
      <AppSidebar role={session.role} fullName={session.fullName} />
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <Topbar title="Moov Aerial Studio" userName={session.fullName} roleLabel={roleLabels[session.role]} role={session.role} />
        <div className="flex-1 space-y-6">{children}</div>
      </div>
    </div>
  );
}
