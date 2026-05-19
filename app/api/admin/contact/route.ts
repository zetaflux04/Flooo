import { connectDB } from "@/lib/db";
import { ContactSubmission } from "@/models/ContactSubmission";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function GET(req: Request) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);
  await connectDB();
  const submissions = await ContactSubmission.find().sort({ createdAt: -1 }).lean();
  return jsonSuccess(submissions);
}
