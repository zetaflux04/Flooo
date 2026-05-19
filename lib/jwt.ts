import { SignJWT, jwtVerify } from "jose";

const USER_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "flooo-user-secret-dev"
);
const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "flooo-admin-secret-dev"
);

export interface UserTokenPayload {
  userId: string;
  role: "user";
  email?: string;
  name?: string;
  phone?: string;
}

export async function createUserToken(
  userId: string,
  meta?: { email?: string; name?: string; phone?: string }
): Promise<string> {
  return new SignJWT({
    userId,
    role: "user",
    email: meta?.email,
    name: meta?.name,
    phone: meta?.phone,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(USER_SECRET);
}

export async function verifyUserToken(token: string): Promise<UserTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, USER_SECRET);
    if (payload.role !== "user") return null;
    const userId = (payload.userId as string) || (payload._id as string);
    if (!userId) return null;
    return {
      userId: String(userId),
      role: "user",
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
      phone: payload.phone as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function createAdminToken(adminId: string, email: string): Promise<string> {
  return new SignJWT({ adminId, email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(ADMIN_SECRET);
}

export async function verifyAdminToken(
  token: string
): Promise<{ adminId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET);
    if (payload.role !== "admin") return null;
    const adminId = payload.adminId as string;
    const email = payload.email as string;
    if (!adminId || !email) return null;
    return { adminId, email };
  } catch {
    return null;
  }
}
