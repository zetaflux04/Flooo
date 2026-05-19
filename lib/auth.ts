import { cookies } from "next/headers";
import {
  createAdminToken,
  createUserToken,
  verifyAdminToken,
  verifyUserToken,
  type UserTokenPayload,
} from "@/lib/jwt";

export type { UserTokenPayload };
export { createAdminToken, createUserToken, verifyAdminToken, verifyUserToken };

export async function getUserFromRequest(request: Request): Promise<UserTokenPayload | null> {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return await verifyUserToken(authHeader.slice(7));
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("userToken")?.value;
  if (token) return await verifyUserToken(token);
  return null;
}

export async function getAdminFromRequest(
  request: Request
): Promise<{ adminId: string; email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  if (token) return await verifyAdminToken(token);
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return await verifyAdminToken(authHeader.slice(7));
  }
  return null;
}

export const USER_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
};
