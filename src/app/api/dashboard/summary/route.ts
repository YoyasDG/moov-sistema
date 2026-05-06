import { requireApiRole } from "@/lib/auth/api";
import { getDashboardSnapshot } from "@/lib/services/dashboard";
import { jsonOk } from "@/lib/http";

export async function GET() {
  const auth = await requireApiRole(["ADMIN", "TEACHER"]);
  if (auth.error) return auth.error;

  return jsonOk(await getDashboardSnapshot());
}
