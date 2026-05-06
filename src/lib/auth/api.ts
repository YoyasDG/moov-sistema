import type { Role } from "@prisma/client";
import { getCurrentSession } from "@/lib/auth/dal";

export async function requireApiRole(roles: Role[]) {
  const session = await getCurrentSession();

  if (!session) {
    return { error: Response.json({ error: "No autenticada." }, { status: 401 }) };
  }

  if (!roles.includes(session.role)) {
    return { error: Response.json({ error: "No autorizada." }, { status: 403 }) };
  }

  return { session };
}
