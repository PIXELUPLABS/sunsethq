"use client";

import { openCookieSettings } from "../lib/cookie-consent";

export function CookieSettingsButton() {
  return (
    <button
      id="replay-cookie-settings"
      type="button"
      onClick={openCookieSettings}
      aria-haspopup="dialog"
      className="min-h-11 w-fit cursor-pointer font-mono text-sm text-white/80 underline underline-offset-4 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      Cookie settings
    </button>
  );
}
