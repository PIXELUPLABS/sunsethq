import type { SignupSignalCode } from "@/modules/lead-capture/lib/signup-monitor";

declare global { interface Window { __replaySignupPageId?: string; __replaySignupReady?: boolean } }
const reported = new Set<SignupSignalCode>();
export function reportSignupFailure(code: SignupSignalCode) {
  if (typeof window === "undefined" || reported.has(code)) return;
  reported.add(code);
  try {
    window.__replaySignupPageId ??= crypto.randomUUID();
    void fetch("/api/signup-signal", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: window.__replaySignupPageId, code }), keepalive: true,
    }).catch(() => {});
  } catch { /* Monitoring must never interrupt a submission. */ }
}
