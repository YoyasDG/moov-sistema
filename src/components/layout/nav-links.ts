import type { Role } from "@prisma/client";
import { Bell, CreditCard, Gauge, GraduationCap, Layers3, PiggyBank, Users } from "lucide-react";

export const dashboardNavByRole: Record<Role, Array<{ href: string; label: string; icon: typeof Gauge }>> = {
  ADMIN: [
    { href: "/dashboard", label: "Dashboard", icon: Gauge },
    { href: "/students", label: "Alumnas", icon: Users },
    { href: "/tutors", label: "Tutores", icon: Users },
    { href: "/admin/users", label: "Usuarios", icon: Users },
    { href: "/groups", label: "Grupos", icon: Layers3 },
    { href: "/payments", label: "Pagos", icon: CreditCard },
    { href: "/enrollments", label: "Inscripciones", icon: GraduationCap },
    { href: "/finance", label: "Finanzas", icon: PiggyBank },
    { href: "/notifications", label: "Avisos", icon: Bell },
    { href: "/settings", label: "Ajustes", icon: Layers3 },
  ],
  TEACHER: [
    { href: "/dashboard", label: "Dashboard", icon: Gauge },
    { href: "/students", label: "Alumnas", icon: Users },
    { href: "/tutors", label: "Tutores", icon: Users },
    { href: "/groups", label: "Grupos", icon: Layers3 },
    { href: "/payments", label: "Pagos", icon: CreditCard },
    { href: "/enrollments", label: "Inscripciones", icon: GraduationCap },
    { href: "/notifications", label: "Avisos", icon: Bell },
    { href: "/finance", label: "Finanzas", icon: PiggyBank },
    { href: "/settings", label: "Ajustes", icon: Layers3 },
  ],
  TUTOR: [],
};
