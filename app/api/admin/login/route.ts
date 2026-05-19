import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { createAdminToken } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

const DEFAULT_ADMIN_EMAIL = "admin@flooo.in";
const DEFAULT_ADMIN_PASSWORD = "flooo@admin123";

function getEnvAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase().trim(),
    password: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return jsonError("Email and password required");

    const adminEmail = email.toLowerCase().trim();
    const envAdmin = getEnvAdminCredentials();

    let valid = false;
    let adminId = "admin_env";

    try {
      await connectDB();
      const admin = await Admin.findOne({ email: adminEmail });

      if (admin) {
        valid = await bcrypt.compare(password, admin.password);
        if (valid) adminId = admin._id.toString();
      } else if (adminEmail === envAdmin.email && password === envAdmin.password) {
        // Allow seeded/env credentials even if admin doc missing
        valid = true;
        const hashed = await bcrypt.hash(envAdmin.password, 12);
        const created = await Admin.findOneAndUpdate(
          { email: envAdmin.email },
          { email: envAdmin.email, password: hashed },
          { upsert: true, new: true }
        );
        adminId = created._id.toString();
      }
    } catch (dbError) {
      console.warn("Admin login DB error, using env credentials:", dbError);
      if (adminEmail === envAdmin.email && password === envAdmin.password) {
        valid = true;
      }
    }

    if (!valid) return jsonError("Invalid credentials", 401);

    const token = await createAdminToken(adminId, adminEmail);

    const res = jsonSuccess({ message: "Login successful", email: adminEmail });
    res.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (e) {
    console.error("admin login:", e);
    return jsonError(e instanceof Error ? e.message : "Login failed", 500);
  }
}

export async function DELETE() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("adminToken", "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
