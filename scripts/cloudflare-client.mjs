import { execFileSync } from "node:child_process";

export function cloudflareClient() {
  const credentials = process.env.CLOUDFLARE_API_TOKEN ? { token: process.env.CLOUDFLARE_API_TOKEN } :
    JSON.parse(execFileSync(process.execPath, ["node_modules/wrangler/bin/wrangler.js", "auth", "token", "--json"], {
      encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    }));
  return async (path, method = "GET", body) => {
    const response = await fetch(`https://api.cloudflare.com/client/v4/${path}`, {
      method, headers: { Authorization: `Bearer ${credentials.token}`, "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30_000),
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(`Cloudflare ${method} ${path} failed (${response.status}): ${result.errors?.map((item) => item.message).join(", ")}`);
    return result.result;
  };
}
