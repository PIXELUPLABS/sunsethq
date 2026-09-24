"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect, useMemo, useState } from "react";
import { CAL_EMBED_NAMESPACE, CAL_EMBED_SCRIPT_URL, getCalBookingConfig } from "../lib/cal-booking";

export function useCalBooking(bookingUrl: string, email: string) {
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const booking = useMemo(() => getCalBookingConfig(bookingUrl, email), [bookingUrl, email]);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    const timer = window.setTimeout(() => setStatus("unavailable"), 15_000);
    const onReady = () => {
      window.clearTimeout(timer);
      if (active) setStatus("ready");
    };
    const onError = () => {
      window.clearTimeout(timer);
      if (active) setStatus("unavailable");
    };

    void getCalApi({ namespace: CAL_EMBED_NAMESPACE, embedJsUrl: CAL_EMBED_SCRIPT_URL }).then((cal) => {
      if (!active) return;
      cal("on", { action: "linkReady", callback: onReady });
      cal("on", { action: "linkFailed", callback: onError });
      cal("ui", { theme: "light", hideEventTypeDetails: true, layout: "month_view" });
      unsubscribe = () => {
        cal("off", { action: "linkReady", callback: onReady });
        cal("off", { action: "linkFailed", callback: onError });
      };
    }).catch(onError);

    return () => {
      active = false;
      window.clearTimeout(timer);
      unsubscribe?.();
    };
  }, []);

  return { ...booking, status };
}
