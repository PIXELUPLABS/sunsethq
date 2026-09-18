"use client";

import { useEffect } from "react";
import { captureVisitAttribution } from "../lib/visit-attribution";
import { hasMarketingConsent, subscribeToConsent } from "@/modules/consent/lib/cookie-consent";
import { stripPendingAttribution } from "@/modules/value-my-data/lib/pending-submission";

export function useVisitAttribution() {
  useEffect(() => {
    const sync = () => {
      captureVisitAttribution();
      if (!hasMarketingConsent()) stripPendingAttribution();
    };
    sync();
    return subscribeToConsent(sync);
  }, []);
}
