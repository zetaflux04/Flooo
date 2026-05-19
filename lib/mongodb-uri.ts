import { execSync } from "child_process";
import dns from "dns";
import { promisify } from "util";

const resolveSrv = promisify(dns.resolveSrv);
const resolveTxt = promisify(dns.resolveTxt);

/** Parse `nslookup -type=SRV` output on Windows. */
function parseSrvFromNslookup(output: string): { name: string; port: number }[] {
  const records: { name: string; port: number }[] = [];
  const lines = output.split(/\r?\n/);
  let currentPort = 27017;
  for (const line of lines) {
    const portMatch = line.match(/port\s*=\s*(\d+)/i);
    if (portMatch) currentPort = parseInt(portMatch[1], 10);
    const hostMatch = line.match(/svr hostname\s*=\s*(\S+)/i);
    if (hostMatch) {
      records.push({ name: hostMatch[1].replace(/\.$/, ""), port: currentPort });
    }
  }
  return records;
}

/** Parse `nslookup -type=TXT` for Atlas replica set params. */
function parseTxtFromNslookup(output: string): string {
  const match = output.match(/"([^"]+)"/);
  return match ? match[1] : "authSource=admin";
}

/**
 * Node on Windows often fails `querySrv` (ECONNREFUSED) while nslookup works.
 * Converts mongodb+srv:// to mongodb:// with explicit hosts when needed.
 */
export async function resolveMongoUri(uri: string): Promise<string> {
  if (process.env.MONGODB_URI_STANDARD?.trim()) {
    return process.env.MONGODB_URI_STANDARD.trim();
  }

  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  const withoutScheme = uri.slice("mongodb+srv://".length);
  const at = withoutScheme.lastIndexOf("@");
  if (at === -1) return uri;

  const credentials = withoutScheme.slice(0, at);
  const rest = withoutScheme.slice(at + 1);
  const slash = rest.indexOf("/");
  const hostname = slash === -1 ? rest.split("?")[0] : rest.slice(0, slash);
  const pathAndQuery = slash === -1 ? "" : rest.slice(slash);
  const dbName = pathAndQuery.split("?")[0].replace(/^\//, "") || "flooo";
  const srvHost = `_mongodb._tcp.${hostname}`;

  let srvRecords: { name: string; port: number }[] = [];

  try {
    const resolved = await resolveSrv(srvHost);
    srvRecords = resolved.map((r) => ({ name: r.name, port: r.port }));
  } catch {
    try {
      const out = execSync(`nslookup -type=SRV ${srvHost}`, {
        encoding: "utf8",
        windowsHide: true,
      });
      srvRecords = parseSrvFromNslookup(out);
    } catch {
      return uri;
    }
  }

  if (srvRecords.length === 0) return uri;

  let txtParams = "ssl=true&authSource=admin";
  try {
    const txt = await resolveTxt(hostname);
    if (txt[0]?.length) txtParams = `ssl=true&${txt[0].join("")}`;
  } catch {
    try {
      const txtOut = execSync(`nslookup -type=TXT ${hostname}`, {
        encoding: "utf8",
        windowsHide: true,
      });
      txtParams = `ssl=true&${parseTxtFromNslookup(txtOut)}`;
    } catch {
      txtParams = "ssl=true&authSource=admin&replicaSet=atlas-shard-0";
    }
  }

  if (!txtParams.includes("ssl=")) {
    txtParams = `ssl=true&${txtParams}`;
  }

  const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");
  return `mongodb://${credentials}@${hosts}/${dbName}?${txtParams}`;
}

export async function getMongoUri(): Promise<string> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define MONGODB_URI in .env");
  }
  return resolveMongoUri(uri);
}
