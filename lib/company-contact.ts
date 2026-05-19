export const COMPANY_PHONE = "8057990999";
export const COMPANY_PHONE_DISPLAY = "+91 80579 90999";
export const COMPANY_PHONE_HREF = "tel:+918057990999";
export const COMPANY_WHATSAPP = "918057990999";

export const COMPANY_EMAIL = "lspenterpriseslko@gmail.com";

export const COMPANY_ADDRESS_LINES = [
  "Adarsh Complex",
  "Rewtapur Road",
  "Vijay Nagar Chauraha",
  "Neelmatha Army Cantt.",
  "Lucknow, Uttar Pradesh",
] as const;

export const COMPANY_ADDRESS = COMPANY_ADDRESS_LINES.join(", ");

export const COMPANY_MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(COMPANY_ADDRESS)}&z=15&output=embed`;
export const COMPANY_MAP_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_ADDRESS)}`;
