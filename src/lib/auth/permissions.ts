import type { Role } from "@prisma/client";

export const dashboardRoles: Role[] = ["ADMIN", "TEACHER"];
export const tutorRoles: Role[] = ["TUTOR"];

export function canManageFinance(role: Role) {
  return role === "ADMIN";
}
