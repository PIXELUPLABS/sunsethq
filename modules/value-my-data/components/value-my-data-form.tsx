"use client";

import dynamic from "next/dynamic";
import { PrimaryButtonHover } from "@/components/ui/primary-button-hover";
import { ChevronDownIcon } from "@/components/ui/icons";
import { useValueMyDataForm } from "../hooks/use-value-my-data-form";
import { FormVerification } from "./form-verification";
import {
  BUSINESS_SIZE_OPTIONS,
  ENGLISH_SHARE_OPTIONS,
  YEARS_OF_OPERATION_OPTIONS,
} from "../lib/constants";

const CalBooking = dynamic(() => import("./cal-booking").then((module) => module.CalBooking), {
  loading: () => <div role="status" className="relative flex min-h-[680px] items-center justify-center bg-white p-8 text-sm text-[#727272]">Loading available times…</div>,
});

const INPUT_CLASS =
  "h-12 w-full border border-[#d4d4d4] bg-transparent px-5 text-[15px] text-black transition-colors duration-150 ease-snap placeholder:text-[#a8a8a8] focus:border-black focus:outline-none";
const SELECT_CLASS = `${INPUT_CLASS} appearance-none pr-10`;
const LABEL_CLASS = "text-sm text-[#727272]";

const CARD_CLASS =
  "relative overflow-hidden bg-white px-6 py-8 shadow-[0_8px_28px_-10px_rgba(20,21,24,0.10)] sm:pt-16 sm:pr-8 sm:pb-[100px] sm:pl-[88px]";

function FormGuideLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 bottom-0 left-10 hidden border-l border-dashed border-black/20 sm:block"
    />
  );
}

const CARD_GRAIN_TEXTURE = "/images/pricing/grain-texture.webp";

function FormGrainTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
      style={{ backgroundImage: `url(${CARD_GRAIN_TEXTURE})`, backgroundSize: "296px 296px" }}
    />
  );
}

export function ValueMyDataForm() {
  const { isSubmitted, booking, isSubmitting, handleSubmit, formRef, resultRef, verification, error } = useValueMyDataForm();

  if (isSubmitted) {
    return (
      <div ref={resultRef} tabIndex={-1} className="scroll-mt-28 outline-none">
        {booking ? <CalBooking bookingUrl={booking.url} email={booking.email} /> : (
          <div role="status" className="relative flex min-h-[420px] flex-col items-center justify-center gap-3 overflow-hidden bg-white p-10 text-center shadow-[0_8px_28px_-10px_rgba(20,21,24,0.10)]">
            <FormGrainTexture />
            <FormGuideLine />
            <p className="relative font-serif text-2xl text-black">Thank you for your interest.</p>
            <p className="relative max-w-[360px] text-sm leading-[1.5] text-[#727272]">
              We&rsquo;ll reach out if it&rsquo;s a fit.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={CARD_CLASS} aria-busy={isSubmitting}>
      <FormGrainTexture />
      <FormGuideLine />

      <fieldset disabled={isSubmitting} className="relative flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="companyName" className={LABEL_CLASS}>
            Company name
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            autoComplete="organization"
            placeholder="Acme Inc."
            required
            maxLength={200}
            className={INPUT_CLASS}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="workEmail" className={LABEL_CLASS}>
            Work email
          </label>
          <input
            id="workEmail"
            name="workEmail"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            maxLength={254}
            className={INPUT_CLASS}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="yearsOfOperation" className={LABEL_CLASS}>
            Years of Operation
          </label>
          <div className="relative">
            <select
              id="yearsOfOperation"
              name="yearsOfOperation"
              required
              defaultValue=""
              className={SELECT_CLASS}
            >
              <option value="" disabled>
                Select years of operation
              </option>
              {YEARS_OF_OPERATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#a8a8a8]" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="businessSize" className={LABEL_CLASS}>
            Number of people who work in the business
          </label>
          <div className="relative">
            <select
              id="businessSize"
              name="businessSize"
              required
              defaultValue=""
              className={SELECT_CLASS}
            >
              <option value="" disabled>
                Select number of people
              </option>
              {BUSINESS_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#a8a8a8]" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="englishShare" className={LABEL_CLASS}>
            Share of internal communications in english
          </label>
          <div className="relative">
            <select
              id="englishShare"
              name="englishShare"
              required
              defaultValue=""
              className={SELECT_CLASS}
            >
              <option value="" disabled>
                Select share of english communications
              </option>
              {ENGLISH_SHARE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#a8a8a8]" />
          </div>
        </div>

        <FormVerification containerRef={verification.containerRef} onReady={verification.onReady} onError={verification.onError} />
        {verification.verificationError && <p role="status" className="text-sm leading-relaxed text-[#727272]">{verification.verificationError}</p>}
        {error && <p role="alert" className="text-sm leading-relaxed text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || !verification.canSubmit}
          className="cta-type group relative mt-2 flex h-13 w-full items-center justify-center overflow-hidden bg-[#141518] text-sm text-white transition-transform duration-150 ease-snap active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
        >
          <PrimaryButtonHover />
          <span className="relative">{isSubmitting ? "Sending…" : verification.fallbackReason ? "Send for review" : "Value my data"}</span>
        </button>
      </fieldset>
    </form>
  );
}
