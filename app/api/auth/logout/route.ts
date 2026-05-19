import { jsonSuccess } from "@/lib/api-helpers";

export async function POST() {
  const res = jsonSuccess({ message: "Logged out" });
  res.cookies.set("userToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
