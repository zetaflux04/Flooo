import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { jsonSuccess, jsonError } from "@/lib/api-helpers";
import { createUserToken, USER_COOKIE_OPTIONS } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return jsonError("Missing identifier or password", 400);
    }

    type LoginUser = {
      _id: { toString(): string };
      name: string;
      email?: string;
      username?: string;
      phone?: string;
      password?: string;
      address?: unknown;
    };
    let user: LoginUser | null = null;

    try {
      await connectDB();
      const isEmail = identifier.includes("@");

      if (isEmail) {
        user = await User.findOne({ email: identifier.toLowerCase().trim() });
      } else {
        user = await User.findOne({ username: identifier.toLowerCase().trim() });
      }

      if (!user) {
        return jsonError("Invalid credentials", 401);
      }

      if (!user.password) return jsonError("Invalid credentials", 401);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return jsonError("Invalid credentials", 401);
      }
    } catch (dbError) {
      if (process.env.NODE_ENV !== "development") {
        console.error("Login DB error:", dbError);
        return jsonError("Service unavailable", 503);
      }
      console.warn("DB connection failed, mocking user login", dbError);
      user = {
        _id: { toString: () => "mock_user_id_" + Date.now() },
        name: identifier.split("@")[0],
        email: identifier.includes("@") ? identifier : undefined,
        username: identifier.includes("@") ? undefined : identifier,
        phone: "",
        address: {},
      };
    }

    const userId = user._id.toString();
    const token = await createUserToken(userId, {
      email: user.email,
      name: user.name,
      phone: user.phone,
    });

    const res = jsonSuccess({
      message: "Login successful",
      token,
      user: {
        _id: userId,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        address: user.address,
      },
    });

    res.cookies.set("userToken", token, USER_COOKIE_OPTIONS);
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return jsonError("Internal server error", 500);
  }
}
