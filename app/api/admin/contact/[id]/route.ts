import { connectDB } from "@/lib/db";
import { ContactSubmission } from "@/models/ContactSubmission";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await getAdminFromRequest(req))) return jsonError("Unauthorized", 401);

  try {
    await connectDB();
    const submission = await ContactSubmission.findByIdAndDelete(params.id);
    if (!submission) return jsonError("Submission not found", 404);
    return jsonSuccess({ message: "Deleted" });
  } catch (e) {
    console.error("admin contact DELETE:", e);
    return jsonError("Failed to delete submission", 500);
  }
}
