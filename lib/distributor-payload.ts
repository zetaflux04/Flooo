const DISTRIBUTOR_UPDATE_FIELDS = [
  "name",
  "code",
  "area",
  "address",
  "city",
  "state",
  "pincode",
  "capacity",
  "about",
  "mobileNumber",
  "isActive",
  "availableProducts",
] as const;

const STRING_FIELDS = new Set([
  "name",
  "code",
  "area",
  "address",
  "city",
  "state",
  "pincode",
  "about",
  "mobileNumber",
]);

export function sanitizeDistributorBody(
  body: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const key of DISTRIBUTOR_UPDATE_FIELDS) {
    if (!(key in body) || body[key] === undefined) continue;

    if (key === "capacity") {
      const n = Number(body[key]);
      if (Number.isFinite(n) && n >= 0) out.capacity = n;
      continue;
    }

    if (STRING_FIELDS.has(key)) {
      const value = String(body[key]).trim();
      if (key === "area" || key === "pincode" || key === "about") {
        if (value) out[key] = value;
      } else {
        out[key] = value;
      }
      continue;
    }

    out[key] = body[key];
  }

  return out;
}

export function distributorValidationMessage(err: unknown): string {
  const e = err as { code?: number; message?: string; errors?: Record<string, { message?: string }> };
  if (e.code === 11000) {
    return "Distributor code already exists";
  }
  if (e.errors) {
    const first = Object.values(e.errors)[0]?.message;
    if (first) return first;
  }
  if (e.message) return e.message;
  return "Failed to save distributor";
}
