"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VerificationFallbackReason } from "@/modules/lead-capture/lib/verification";

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
  (process.env.NODE_ENV === "development" ? "1x00000000000000000000AA" : "");

export function useTurnstile(enabled = true) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [fallbackReason, setFallbackReason] = useState<VerificationFallbackReason>();
  const allowManualReview = useCallback((reason: VerificationFallbackReason) => {
    setToken("");
    setFallbackReason(reason);
    setVerificationError("Verification isn’t available. You can still send your request for manual review.");
  }, []);
  const onError = useCallback(() => allowManualReview("script_unavailable"), [allowManualReview]);
  const onReady = useCallback(() => {
    if (!sitekey) { onError(); return; }
    setScriptReady(true);
  }, [onError]);
  useEffect(() => {
    if (!enabled || token || fallbackReason) return;
    const timer = window.setTimeout(() => allowManualReview("verification_timeout"), 15_000);
    return () => window.clearTimeout(timer);
  }, [enabled, token, fallbackReason, allowManualReview]);
  useEffect(() => {
    if (!enabled || !scriptReady) return;
    if (!containerRef.current || !window.turnstile || widgetRef.current !== null) return;
    if (!sitekey) return;
    let renderFailureTimer: number | undefined;
    try {
      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey, action: "lead_capture", theme: "light", size: "flexible",
        callback: (value: string) => { setToken(value); setFallbackReason(undefined); setVerificationError(""); },
        "expired-callback": () => setToken(""),
        "error-callback": () => allowManualReview("challenge_unavailable"),
        "timeout-callback": () => allowManualReview("verification_timeout"),
      });
    } catch { renderFailureTimer = window.setTimeout(() => allowManualReview("challenge_unavailable"), 0); }
    return () => {
      window.clearTimeout(renderFailureTimer);
      if (widgetRef.current !== null) window.turnstile?.remove(widgetRef.current);
      widgetRef.current = null;
    };
  }, [enabled, scriptReady, allowManualReview]);
  const reset = useCallback(() => {
    setToken("");
    try { if (widgetRef.current !== null) window.turnstile?.reset(widgetRef.current); }
    catch { allowManualReview("challenge_unavailable"); }
  }, [allowManualReview]);
  return { containerRef, token, onReady, onError, reset, verificationError, fallbackReason, canSubmit: !!token || !!fallbackReason };
}
