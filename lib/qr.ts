import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const QR_PATH = path.join(process.cwd(), "public", "flooo-qr.png");

const DEFAULT_PRODUCTION_ORIGIN = "https://www.lspenterprises.in";

function isLocalOrigin(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url);
}

function resolveOrigin(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) return siteUrl.replace(/\/$/, "");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    const candidates = appUrl.split(",").map((u) => u.trim()).filter(Boolean);
    const production = candidates.find((u) => !isLocalOrigin(u));
    if (production) return production.replace(/\/$/, "");
    if (candidates[0]) return candidates[0].replace(/\/$/, "");
  }

  return DEFAULT_PRODUCTION_ORIGIN;
}

export function getStoresUrl(): string {
  return `${resolveOrigin()}/stores`;
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
