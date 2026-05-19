import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { generateQRCode } from "../lib/qr";

generateQRCode()
  .then((p) => console.log("QR saved to", p))
  .catch(console.error);
