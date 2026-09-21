"use client";

import dynamic from "next/dynamic";
import { useCookieConsent } from "../hooks/use-cookie-consent";

const CookiePreferences = dynamic(() => import("./cookie-preferences").then(module => module.CookiePreferences), { ssr: false });
const BUTTON_CLASS = "min-h-8 min-w-16 cursor-pointer border border-[#141518] px-3 py-1 text-xs transition-transform duration-150 ease-snap active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2";

export function CookieConsent() {
  const { status, settingsOpen, openSettings, closeSettings, accept, reject } = useCookieConsent();
  return (
    <>
      {status === "unknown" && (
        <section aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-[80] max-h-[100dvh] overflow-y-auto border-t border-black/15 bg-[#faf9f6] px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-[#141518] shadow-[0_-2px_12px_rgba(0,0,0,0.04)] sm:px-6">
          <div className="mx-auto flex max-w-[1560px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-sm leading-5 text-[#565656]">
              We use optional browser storage to understand how you found us. Change your choice in Cookie settings.{" "}
              <button type="button" onClick={openSettings} aria-haspopup="dialog" className="min-h-6 cursor-pointer underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">Details</button>
            </p>
            <div className="flex items-center justify-end gap-2 sm:shrink-0">
              <button type="button" onClick={reject} aria-label="Reject optional" className={BUTTON_CLASS}>Reject</button>
              <button type="button" onClick={accept} aria-label="Accept optional" className={BUTTON_CLASS}>Accept</button>
            </div>
          </div>
        </section>
      )}
      {settingsOpen && <CookiePreferences onClose={closeSettings} />}
    </>
  );
}
