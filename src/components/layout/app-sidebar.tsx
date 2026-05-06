"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { LogOut, Sparkles } from "lucide-react";
import Image from "next/image";
import { dashboardNavByRole } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar({
  role,
  fullName,
}: {
  role: Role;
  fullName: string;
}) {
  const pathname = usePathname();
  const items = dashboardNavByRole[role];

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <aside
      className="hidden w-[19rem] shrink-0 flex-col justify-between overflow-hidden rounded-[2.2rem] p-7 text-sidebar-foreground shadow-[0_28px_80px_-34px_rgba(56,25,88,0.85)] lg:flex"
      style={{ backgroundImage: "var(--sidebar)" }}
    >
      <div className="space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3">
            <Image src="/moov.svg" alt="Moov Aerial Studio" width={110} height={30} priority className="h-7 w-auto" />
            <div className="hidden rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground lg:inline-flex">
              <Sparkles className="h-3.5 w-3.5 inline-block mr-1" />
              Aerial Studio
            </div>
          </div>
          <div>
            <h2 className="font-heading text-[2.4rem] leading-[0.92]">Aerial Studio</h2>
            <p className="mt-2 font-subtitle text-lg text-white/72">{fullName}</p>
          </div>
        </div>

        <nav className="space-y-2.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-[1.4rem] px-4 py-3.5 text-[0.98rem] transition-all duration-300",
                  active
                    ? "bg-white text-primary shadow-[0_18px_40px_-24px_rgba(255,255,255,0.85)]"
                    : "text-white/72 hover:translate-x-1 hover:bg-white/10 hover:text-white",
                )}
              >
                <span className={cn("rounded-[0.95rem] p-2 transition", active ? "bg-accent text-primary" : "bg-white/8 text-white/80 group-hover:bg-white/12")}>
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Button variant="secondary" className="justify-start rounded-[1.4rem] border-white/10 bg-white/12 text-white hover:bg-white/18 hover:text-white" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
        Cerrar sesion
      </Button>
    </aside>
  );
}
