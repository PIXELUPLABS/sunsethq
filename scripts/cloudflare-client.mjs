import { execFileSync } from "node:child_process";

export function cloudflareToken(credentials) {
  if (typeof credentials?.token !== "string" || !credentials.token.trim()) {
    throw new Error("Wrangler returned no bearer token. Set CLOUDFLARE_API_TOKEN or run wrangler login.");
  }
  return credentials.token;
}

export function cloudflareClient() {
  const credentials = process.env.CLOUDFLARE_API_TOKEN ? { token: process.env.CLOUDFLARE_API_TOKEN } :
    JSON.parse(execFileSync(process.execPath, ["node_modules/wrangler/bin/wrangler.js", "auth", "token", "--json"], {
      encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    }));
  const token = cloudflareToken(credentials);
  return async (path, method = "GET", body) => {
    const response = await fetch(`https://api.cloudflare.com/client/v4/${path}`, {
      method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30_000),
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(`Cloudflare ${method} ${path} failed (${response.status}): ${result.errors?.map((item) => item.message).join(", ")}`);
    return result.result;
  };
}
