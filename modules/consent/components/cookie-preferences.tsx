"use client";

import Link from "next/link";
import { useCookiePreferences } from "../hooks/use-cookie-preferences";

const BUTTON_CLASS = "min-h-11 cursor-pointer border border-[#141518] px-4 py-3 text-sm transition-transform duration-150 ease-snap active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4";

export function CookiePreferences({ onClose }: { onClose: () => void }) {
  const { performance, changePerformance, dialogRef, marketing, globalPrivacyControl, changeMarketing, save, reject } = useCookiePreferences(onClose);
  return (
    <dialog ref={dialogRef} onCancel={onClose} aria-labelledby="cookie-settings-title" aria-describedby="cookie-settings-description"
      className="fixed inset-0 m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-lg overflow-y-auto border border-black/15 bg-[#faf9f6] p-6 text-[#141518] shadow-xl backdrop:bg-black/40 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <h2 id="cookie-settings-title" className="font-serif text-2xl">Cookie settings</h2>
        <button type="button" onClick={onClose} aria-label="Close cookie settings" className="-mt-2 -mr-2 flex size-11 shrink-0 cursor-pointer items-center justify-center text-2xl active:scale-[0.97] focus-visible:outline-2">×</button>
      </div>
      <p id="cookie-settings-description" className="mt-3 text-sm leading-relaxed text-[#565656]">Choose how Replay uses cookies and browser storage. You can change your choice at any time.</p>
      <Link href="/privacy" onClick={onClose} className="mt-1 inline-flex min-h-11 items-center text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Read our privacy policy</Link>
      <div className="mt-6 border-y border-black/15 py-5">
        <div className="flex items-center justify-between gap-4"><h3 className="font-medium">Necessary</h3><span className="font-mono text-xs uppercase text-[#565656]">Always on</span></div>
        <p className="mt-2 text-sm leading-relaxed text-[#565656]">Remembers your privacy choice, protects forms from abuse, and helps recover a valuation request if submission fails.</p>
      </div>
      <label className="flex cursor-pointer items-start gap-4 border-b border-black/15 py-5">
        <span className="flex-1"><span className="font-medium">Campaign measurement</span><span className="mt-2 block text-sm leading-relaxed text-[#565656]">Remembers the campaign and page that brought you here and includes them with a valuation request. Off until you agree.</span></span>
        <input type="checkbox" checked={marketing} onChange={changeMarketing} disabled={globalPrivacyControl} className="mt-1 size-5 shrink-0 accent-[#141518]" />
      </label>
      <label className="flex cursor-pointer items-start gap-4 border-b border-black/15 py-5">
        <span className="flex-1"><span className="font-medium">Website performance</span><span className="mt-2 block text-sm leading-relaxed text-[#565656]">Allows Cloudflare Web Analytics to measure page loading, responsiveness, and layout stability. Off until you agree.</span></span>
        <input type="checkbox" checked={performance} onChange={changePerformance} disabled={globalPrivacyControl} className="mt-1 size-5 shrink-0 accent-[#141518]" />
      </label>
      {globalPrivacyControl && <p className="mt-4 text-sm leading-relaxed">Global Privacy Control is enabled in your browser. Optional measurement is off.</p>}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button type="button" onClick={reject} className={BUTTON_CLASS}>Reject optional</button>
        <button type="button" onClick={save} className={`${BUTTON_CLASS} bg-[#141518] text-white`}>Save preferences</button>
      </div>
    </dialog>
  );
}
