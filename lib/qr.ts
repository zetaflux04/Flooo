import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const QR_PATH = path.join(process.cwd(), "public", "flooo-qr.png");

export function getStoresUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/stores`;
}

export async function generateQRCode(): Promise<string> {
  const url = getStoresUrl();
  const dir = path.dirname(QR_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await QRCode.toFile(QR_PATH, url, {
    width: 512,
    margin: 2,
    color: { dark: "#1A1A4E", light: "#FFFFFF" },
  });

  return QR_PATH;
}

export async function ensureQRCode(): Promise<string> {
  if (fs.existsSync(QR_PATH)) return QR_PATH;
  return generateQRCode();
}

export function getQRPath(): string {
  return QR_PATH;
}
