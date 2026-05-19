import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { jsonSuccess, jsonError } from "@/lib/api-helpers";
import { createUserToken, USER_COOKIE_OPTIONS } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, identifier, password, phone } = await req.json();

    if (!name || !password || !identifier) {
      return jsonError("Missing required fields", 400);
    }

    const isEmail = identifier.includes("@");
    const email = isEmail ? identifier.toLowerCase().trim() : undefined;
    const username = !isEmail ? identifier.toLowerCase().trim() : undefined;

    let newUser: {
      _id: { toString(): string };
      name: string;
      email?: string;
      username?: string;
      phone?: string;
    } | null = null;

    try {
      await connectDB();

      if (email) {
        const existing = await User.findOne({ email });
        if (existing) return jsonError("User already exists", 400);
      } else if (username) {
        const existing = await User.findOne({ username });
        if (existing) return jsonError("Username already taken", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = await User.create({
        name,
        email,
        username,
        password: hashedPassword,
        phone: phone || "",
      });
    } catch (dbError) {
      if (process.env.NODE_ENV !== "development") {
        console.error("Register DB error:", dbError);
        return jsonError("Service unavailable", 503);
      }
      console.warn("DB connection failed, mocking user registration", dbError);
      newUser = {
        _id: { toString: () => "mock_user_id_" + Date.now() },
        name,
        email,
        username,
        phone: phone || "",
      };
    }

    const userId = newUser._id.toString();
    const token = await createUserToken(userId, {
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
    });

    const res = jsonSuccess({
      message: "Registration successful",
      token,
      user: {
        _id: userId,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        phone: newUser.phone,
      },
    });

    res.cookies.set("userToken", token, USER_COOKIE_OPTIONS);
    return res;
  } catch (error) {
    console.error("Register error:", error);
    return jsonError(error instanceof Error ? error.message : "Internal server error", 500);
  }
}
