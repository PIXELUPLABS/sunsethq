"use client";

import Script from "next/script";
import type { useTurnstile } from "../hooks/use-turnstile";

export function FormVerification({ containerRef, onReady, onError }: Pick<ReturnType<typeof useTurnstile>, "containerRef" | "onReady" | "onError">) {
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={onReady}
        onError={onError}
      />
      <div ref={containerRef} className="min-h-[65px]" />
    </>
  );
}
