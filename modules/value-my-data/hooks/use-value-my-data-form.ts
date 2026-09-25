"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { captureVisitAttribution, type VisitAttribution } from "@/modules/attribution/lib/visit-attribution";
import { hasMarketingConsent, subscribeToConsent } from "@/modules/consent/lib/cookie-consent";
import { reportSignupFailure } from "../lib/signup-monitor";
import { useTurnstile } from "./use-turnstile";
import { clearPendingSubmission, readPendingSubmission, savePendingSubmission } from "../lib/pending-submission";

export function useValueMyDataForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [booking, setBooking] = useState<{ url: string; email: string; submissionId: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const submittingRef = useRef(false);
  const submissionRef = useRef<{ fingerprint: string; id: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.__replaySignupReady = true;
  }, []);
  useEffect(() => {
    if (!isSubmitted || !resultRef.current) return;
    resultRef.current.focus({ preventScroll: true });
    resultRef.current.scrollIntoView({ block: "start" });
  }, [isSubmitted]);
  const attemptedAttribution = useRef<VisitAttribution | null>(null);
  useEffect(() => subscribeToConsent(() => {
    if (!hasMarketingConsent()) attemptedAttribution.current = null;
  }), []);
  useEffect(() => {
    const pending = readPendingSubmission();
    if (!pending || !formRef.current) return;
    submissionRef.current = { fingerprint: JSON.stringify(pending.answers), id: pending.id };
    attemptedAttribution.current = { campaign: pending.campaign, ...(pending.landingPath ? { landingPath: pending.landingPath } : {}) };
    for (const [name, value] of Object.entries(pending.answers)) {
      const input = formRef.current.elements.namedItem(name);
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) input.value = value;
    }
  }, []);
  const verification = useTurnstile(!isSubmitted);
  const { token, reset, fallbackReason } = verification;
  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    if (!token && !fallbackReason) { setSubmissionError("Please wait for verification to finish."); return; }
    const form = new FormData(event.currentTarget);
    const answers = {
      companyName: String(form.get("companyName") ?? "").trim(),
      workEmail: String(form.get("workEmail") ?? "").trim().toLowerCase(),
      yearsOfOperation: String(form.get("yearsOfOperation") ?? ""),
      businessSize: String(form.get("businessSize") ?? ""),
      englishShare: String(form.get("englishShare") ?? ""),
    };
    if (!hasMarketingConsent()) attemptedAttribution.current = { campaign: {} };
    else attemptedAttribution.current ??= captureVisitAttribution();
    const { campaign, landingPath } = attemptedAttribution.current;
    // Consent or verification can change during an uncertain request. Only
    // different answers create a new inquiry; metadata must not duplicate it.
    const fingerprint = JSON.stringify(answers);
    if (submissionRef.current?.fingerprint !== fingerprint) {
      submissionRef.current = { fingerprint, id: crypto.randomUUID() };
    }
    savePendingSubmission({ answers, campaign, landingPath, id: submissionRef.current.id, savedAt: Date.now() });
    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmissionError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, submissionId: submissionRef.current.id, turnstileToken: token,
          ...(!token && fallbackReason ? { verificationFallback: fallbackReason } : {}), campaign, landingPath }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json().catch(() => null) as { accepted?: boolean; bookingUrl?: string | null; error?: string } | null;
      if (response.status !== 202 || !result?.accepted) {
        throw new Error(result?.error ?? "We couldn’t receive your request. Please try again.");
      }
      if (result.bookingUrl) setBooking({ url: result.bookingUrl, email: answers.workEmail, submissionId: submissionRef.current.id });
      setIsSubmitted(true);
      clearPendingSubmission();
    } catch (error) {
      reportSignupFailure("submission_failed");
      setSubmissionError(error instanceof Error && !["TimeoutError", "TypeError"].includes(error.name) ? error.message : "We couldn’t confirm receipt. Your answers are saved in this tab—please try again.");
      reset();
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [token, reset, fallbackReason]);
  return { isSubmitted, booking, isSubmitting, handleSubmit, formRef, resultRef, verification, error: submissionError };
}
