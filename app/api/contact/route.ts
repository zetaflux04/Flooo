import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactSubmission } from "@/models/ContactSubmission";
import { sendContactEmail } from "@/lib/mailer";
import { jsonError, jsonSuccess } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, city, pincode, message } = await req.json();
    if (!name || !phone || !message) {
      return jsonError("Name, phone, and message are required");
    }

    await connectDB();
    const submission = await ContactSubmission.create({
      name,
      phone,
      email,
      city,
      pincode,
      message,
    });

    await sendContactEmail({ name, phone, email, city, pincode, message });

    return jsonSuccess({ message: "Thank you! We will contact you soon.", id: submission._id });
  } catch (e) {
    console.error("contact POST:", e);
    return jsonError("Failed to submit form", 500);
  }
}
