"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@/components/ui/icons";
import {
  BUSINESS_SIZE_OPTIONS,
  ENGLISH_SHARE_OPTIONS,
  YEARS_OF_OPERATION_OPTIONS,
} from "../lib/constants";

/** Bigger than the Figma comp's own 39px inputs - per review, that literal
 * size read as too small/compact against this card's own padding, making
 * the whitespace above and below the field column feel disproportionate
 * rather than intentional. Growing the fields (not shrinking the padding)
 * is the fix: a card built around 48px fields and a 52px button carries
 * generous padding comfortably, where one built around 39px fields did not. */
const INPUT_CLASS =
  "h-12 w-full border border-[#d4d4d4] bg-transparent px-5 text-[15px] text-black transition-colors duration-150 ease-snap placeholder:text-[#a8a8a8] focus:border-black focus:outline-none";
const SELECT_CLASS = `${INPUT_CLASS} appearance-none pr-10`;
const LABEL_CLASS = "text-sm text-[#727272]";

/**
 * Card padding started as the Figma comp's own measured spec (node 6724-164
 * in file AYzBKhVneW9mct6tUchEo7: 88px left / 32px right / ~101px top /
 * ~89px bottom), but that comp's fields were only 39px tall - padding this
 * generous around fields that small read as disproportionate/"weird" per
 * review, fixed by growing the fields (see `INPUT_CLASS`, the button below)
 * rather than shrinking the padding. Top padding then got cut well past
 * that spec on its own (112px down to 64px) per a second round of review -
 * once the fields were bigger, that much air above "First name" alone still
 * read as too much, independent of the bottom's own 100px. Below `sm:` the
 * decorations are hidden and the card falls back to even, compact padding;
 * the comp's gutters would just crowd a full-width phone layout.
 */
const CARD_CLASS =
  "relative overflow-hidden bg-white px-6 py-8 shadow-[0_8px_28px_-10px_rgba(20,21,24,0.10)] sm:pt-16 sm:pr-8 sm:pb-[100px] sm:pl-[88px]";

/** Single dashed rule down the card, 40px in from its left edge - between
 * the dot rail and the field column, matching the comp. Its own graphic
 * defines a second rule and a diagonal mark further right, but neither
 * survives the card's clip in the rendered comp, so neither is drawn here. */
function FormGuideLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 bottom-0 left-10 hidden border-l border-dashed border-black/20 sm:block"
    />
  );
}

/** Same grain asset the backdrop block behind this card tiles
 * (`value-my-data-hero.tsx`, borrowed from `benefits-section.tsx`) - that
 * block runs it at full strength on `soft-light` because its base is a
 * saturated dark blue; `soft-light` barely registers on white at all, and
 * this asset is busy/high-contrast enough that `multiply` at anywhere near
 * full strength turns the card a flat grey instead of a grain. Dialled down
 * to a low opacity so it reads as a faint paper grain without fighting the
 * field borders or label contrast. */
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

/**
 * No backend integration exists for this form yet, so submission is mocked
 * locally - it swaps the form for a confirmation state instead of posting
 * anywhere. The payload is built and logged so the shape is there to wire
 * up once a real handler exists, but nothing is sent yet.
 */
export function ValueMyDataForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    console.log(payload);

    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-3 overflow-hidden bg-white p-10 text-center shadow-[0_8px_28px_-10px_rgba(20,21,24,0.10)]">
        <FormGrainTexture />
        <FormGuideLine />
        <p className="relative font-serif text-2xl text-black">Thanks — we&rsquo;ll be in touch.</p>
        <p className="relative max-w-[360px] text-sm leading-[1.5] text-[#727272]">
          Someone from our team will follow up with an initial view of what your data could be
          worth.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={CARD_CLASS}>
      <FormGrainTexture />
      <FormGuideLine />

      <div className="relative flex flex-col gap-6">
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

        <button
          type="submit"
          className="group relative mt-2 flex h-13 w-full items-center justify-center overflow-hidden bg-[#141518] font-serif text-sm tracking-wide text-white uppercase transition-transform duration-150 ease-snap active:scale-[0.98]"
        >
          <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-30" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100">
            <Image src="/images/color-strip-left.svg" alt="" fill className="object-cover" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100">
            <Image src="/images/color-strip-right.svg" alt="" fill className="object-cover" />
          </div>
          <span className="relative">Value my data</span>
        </button>
      </div>
    </form>
  );
}
