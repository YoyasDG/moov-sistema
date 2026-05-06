import { requireApiRole } from "@/lib/auth/api";
import { getTutorPortalData } from "@/lib/services/portal";
import { jsonOk } from "@/lib/http";

export async function GET() {
  const auth = await requireApiRole(["TUTOR"]);
  if (auth.error) return auth.error;

  return jsonOk(await getTutorPortalData(auth.session.id));
}
