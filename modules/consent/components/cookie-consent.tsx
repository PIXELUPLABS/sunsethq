"use client";

import dynamic from "next/dynamic";
import { useCookieConsent } from "../hooks/use-cookie-consent";

const CookiePreferences = dynamic(() => import("./cookie-preferences").then(module => module.CookiePreferences), { ssr: false });
const BUTTON_CLASS = "min-h-11 cursor-pointer border border-[#141518] px-3 py-3 text-sm transition-transform duration-150 ease-snap active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4";

export function CookieConsent() {
  const { status, settingsOpen, openSettings, closeSettings, accept, reject } = useCookieConsent();
  return (
    <>
      {status === "unknown" && (
        <section aria-label="Cookie consent" className="fixed inset-x-4 bottom-4 z-[80] max-h-[calc(100dvh-32px)] overflow-y-auto border border-black/15 bg-[#faf9f6] p-4 text-[#141518] shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:right-auto sm:bottom-6 sm:left-6 sm:w-[380px]">
          <h2 className="font-serif text-lg">A note on cookies</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#565656]">We use essential cookies and storage to keep Replay working. Optional measurement helps us remember which campaign brought you here and measure website performance.</p>
          <p className="mt-2 text-sm leading-relaxed text-[#565656]">Change your choice or withdraw consent anytime using Cookie settings in the footer.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={reject} className={BUTTON_CLASS}>Reject optional</button>
            <button type="button" onClick={accept} className={BUTTON_CLASS}>Accept optional</button>
          </div>
          <button type="button" onClick={openSettings} aria-haspopup="dialog" className="min-h-11 w-full cursor-pointer text-xs text-[#565656] underline underline-offset-4 focus-visible:outline-2">Customize preferences</button>
        </section>
      )}
      {settingsOpen && <CookiePreferences onClose={closeSettings} />}
    </>
  );
}
