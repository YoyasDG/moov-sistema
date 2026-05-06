import { requireRole } from "@/lib/auth/dal";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["TUTOR"]);

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-5 py-6 md:px-8">
      <header className="mb-8 flex items-center justify-between rounded-[28px] border border-border bg-card px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Portal mamá/tutor</p>
          <h1 className="text-2xl font-semibold">{session.fullName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <form action="/api/auth/logout" method="post">
            <Button variant="secondary" type="submit">
              Salir
            </Button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
