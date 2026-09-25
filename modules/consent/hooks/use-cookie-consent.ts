"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { COOKIE_SETTINGS_EVENT, getConsentStatus, saveConsent, subscribeToConsent } from "../lib/cookie-consent";

const serverStatus = () => "loading" as const;

export function useCookieConsent() {
  const status = useSyncExternalStore(subscribeToConsent, getConsentStatus, serverStatus);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const accept = useCallback(() => saveConsent(true, true), []);
  const reject = useCallback(() => saveConsent(false), []);

  useEffect(() => {
    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
  }, [openSettings]);

  return { status, settingsOpen, openSettings, closeSettings, accept, reject };
}
