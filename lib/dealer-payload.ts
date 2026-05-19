const DEALER_UPDATE_FIELDS = [
  "name",
  "code",
  "plantNumber",
  "city",
  "state",
  "address",
  "phone",
  "manager",
  "managerPhone",
  "email",
  "about",
  "pincode",
  "timings",
  "capacity",
  "isActive",
  "availableProducts",
] as const;

export function sanitizeDealerBody(
  body: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const key of DEALER_UPDATE_FIELDS) {
    if (!(key in body) || body[key] === undefined) continue;

    if (key === "plantNumber") {
      const n = Number(body[key]);
      if (!Number.isFinite(n) || n < 1) continue;
      out.plantNumber = Math.floor(n);
      continue;
    }

    if (key === "capacity") {
      const n = Number(body[key]);
      if (Number.isFinite(n)) out.capacity = n;
      continue;
    }

    out[key] = body[key];
  }

  return out;
}

export function dealerValidationMessage(err: unknown): string {
  const e = err as { code?: number; message?: string; errors?: Record<string, { message?: string }> };
  if (e.code === 11000) {
    if (String(e.message).includes("plantNumber")) {
      return "Plant number already assigned to another dealer";
    }
    return "Dealer code already exists";
  }
  if (e.errors) {
    const first = Object.values(e.errors)[0]?.message;
    if (first) return first;
  }
  if (e.message) return e.message;
  return "Failed to save dealer";
}
