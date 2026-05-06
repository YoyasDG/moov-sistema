import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import type { Role } from "@prisma/client";

export function Topbar({
  title,
  userName,
  roleLabel,
  role,
}: {
  title: string;
  userName: string;
  roleLabel: string;
  role: Role;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <MobileNav role={role} />
        <div className="flex items-center gap-3">
          <Image src="/moov.svg" alt="Moov Aerial Studio" width={120} height={34} className="h-8 w-auto" />
          <h2 className="font-heading text-[1.6rem] leading-none tracking-tight hidden sm:block">{title}</h2>
        </div>
      </div>
      <div className="surface-panel flex items-center gap-3 rounded-[1.5rem] px-3 py-2">
        <ThemeToggle />
        <div className="hidden text-right md:block">
          <p className="text-sm font-medium">{userName}</p>
          <p className="font-subtitle text-sm text-muted-foreground">Panel activo</p>
        </div>
        <Avatar>
          <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
