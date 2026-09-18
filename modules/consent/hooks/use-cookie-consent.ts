"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { getConsentStatus, saveConsent, subscribeToConsent } from "../lib/cookie-consent";

const serverStatus = () => "loading" as const;

export function useCookieConsent() {
  const status = useSyncExternalStore(subscribeToConsent, getConsentStatus, serverStatus);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const accept = useCallback(() => saveConsent(true), []);
  const reject = useCallback(() => saveConsent(false), []);

  return { status, settingsOpen, openSettings, closeSettings, accept, reject };
}
