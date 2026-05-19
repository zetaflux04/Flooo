import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(req: Request) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return jsonError("Unauthorized", 401);
  return jsonSuccess({ email: admin.email });
}
