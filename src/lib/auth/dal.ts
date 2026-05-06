import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionCookie, verifySessionToken } from "@/lib/auth/session";
import type { Role } from "@prisma/client";

export const getCurrentSession = cache(async () => {
  const token = await getSessionCookie();
  const payload = verifySessionToken(token);

  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      phone: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return user;
});

export async function requireUser() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(roles: Role[]) {
  const session = await requireUser();

  if (!roles.includes(session.role)) {
    redirect(session.role === "TUTOR" ? "/portal" : "/dashboard");
  }

  return session;
}
