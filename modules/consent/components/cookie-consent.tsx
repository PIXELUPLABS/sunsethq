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
        <section aria-label="Cookie consent" className="fixed inset-x-4 bottom-4 z-[80] max-h-[calc(100dvh-32px)] overflow-y-auto border border-black/15 bg-[#faf9f6] p-6 text-[#141518] shadow-[0_8px_40px_rgba(0,0,0,0.16)] sm:right-auto sm:bottom-6 sm:left-6 sm:w-[440px]">
          <h2 className="font-serif text-2xl">Your privacy, your choice.</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#565656]">We use essential cookies and browser storage to keep Replay working. With your permission, we also remember which campaign brought you here.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" onClick={reject} className={BUTTON_CLASS}>Reject optional</button>
            <button type="button" onClick={accept} className={BUTTON_CLASS}>Accept optional</button>
          </div>
          <button type="button" onClick={openSettings} className="mt-2 min-h-11 w-full cursor-pointer text-sm underline underline-offset-4 focus-visible:outline-2">Customize preferences</button>
        </section>
      )}
      {status !== "loading" && status !== "unknown" && (
        <button id="replay-cookie-settings" type="button" onClick={openSettings} aria-label="Open cookie settings" className="fixed bottom-4 left-4 z-[70] min-h-11 cursor-pointer border border-black/20 bg-[#faf9f6] px-4 py-2 font-mono text-xs text-[#141518] shadow-sm transition-transform duration-150 ease-snap active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4">Cookie settings</button>
      )}
      {settingsOpen && <CookiePreferences onClose={closeSettings} />}
    </>
  );
}
