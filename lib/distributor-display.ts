export type DistributorLocationFields = {
  area?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
};

/** Primary location line: area, city, state */
export function formatDistributorLocationLine(d: DistributorLocationFields): string {
  const line = [d.area, d.city, d.state].filter(Boolean).join(", ");
  return line || d.address;
}

/** Full location including pincode */
export function formatDistributorFullLocation(d: DistributorLocationFields): string {
  return [d.area, d.city, d.state, d.pincode].filter(Boolean).join(", ") || d.address;
}
