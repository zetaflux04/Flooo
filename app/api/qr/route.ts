import { NextResponse } from "next/server";
import fs from "fs";
import { generateQRCode } from "@/lib/qr";

export async function GET() {
  try {
    const path = await generateQRCode();
    const buffer = fs.readFileSync(path);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="flooo-qr.png"',
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    console.error("qr GET:", e);
    return NextResponse.json({ error: "Failed to generate QR" }, { status: 500 });
  }
}
