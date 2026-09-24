"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { hasPerformanceConsent, hasGlobalPrivacyControl, hasMarketingConsent, saveConsent } from "../lib/cookie-consent";

export function useCookiePreferences(onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [marketing, setMarketing] = useState(hasMarketingConsent);
  const [performance, setPerformance] = useState(hasPerformanceConsent);
  const changePerformance = useCallback((event: ChangeEvent<HTMLInputElement>) => setPerformance(event.target.checked), []);
  const globalPrivacyControl = hasGlobalPrivacyControl();
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
      else document.getElementById("replay-cookie-settings")?.focus();
    };
  }, []);
  const changeMarketing = useCallback((event: ChangeEvent<HTMLInputElement>) => setMarketing(event.target.checked), []);
  const save = useCallback(() => { saveConsent(marketing, performance); onClose(); }, [marketing, performance, onClose]);
  const reject = useCallback(() => { saveConsent(false); onClose(); }, [onClose]);
  return { performance, changePerformance, dialogRef, marketing, globalPrivacyControl, changeMarketing, save, reject };
}
