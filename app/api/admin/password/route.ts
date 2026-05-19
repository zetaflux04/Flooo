import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { getAdminFromRequest } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return jsonError("Unauthorized", 401);

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return jsonError("Current and new password are required");
    }
    if (newPassword.length < 6) {
      return jsonError("New password must be at least 6 characters");
    }

    await connectDB();
    const doc = await Admin.findOne({ email: admin.email });
    if (!doc) return jsonError("Admin account not found", 404);

    const valid = await bcrypt.compare(currentPassword, doc.password);
    if (!valid) return jsonError("Current password is incorrect", 401);

    doc.password = await bcrypt.hash(newPassword, 12);
    await doc.save();

    return jsonSuccess({ message: "Password updated successfully" });
  } catch (e) {
    console.error("admin password:", e);
    return jsonError(e instanceof Error ? e.message : "Failed to update password", 500);
  }
}
