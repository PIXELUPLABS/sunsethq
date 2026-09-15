"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@/components/ui/icons";
import { COMPANY_SIZE_OPTIONS, DATA_TYPE_OPTIONS } from "../lib/constants";
import { FormDecorativeRail } from "./form-decorative-rail";
import { FormGuideLines } from "./form-guide-lines";

const INPUT_CLASS =
  "h-[39px] w-full border border-[#d4d4d4] bg-transparent px-4 text-sm text-black transition-colors duration-150 ease-snap placeholder:text-[#a8a8a8] focus:border-black focus:outline-none";
const SELECT_CLASS = `${INPUT_CLASS} appearance-none pr-10`;
const LABEL_CLASS = "text-sm text-[#727272]";

/**
 * No backend integration exists for this form yet, so submission is mocked
 * locally - it swaps the form for a confirmation state instead of posting
 * anywhere. Wire this up to a real handler once one exists.
 */
export function ValueMyDataForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-2xl bg-white p-10 text-center shadow-[0_12px_32px_-8px_rgba(20,21,24,0.08)]">
        <FormGuideLines />
        <p className="relative font-serif text-2xl text-black">Thanks — we&rsquo;ll be in touch.</p>
        <p className="relative max-w-[360px] text-sm leading-[1.5] text-[#727272]">
          Someone from our team will follow up with an initial view of what your data could be
          worth.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-2xl bg-white p-[30px] shadow-[0_12px_32px_-8px_rgba(20,21,24,0.08)]"
    >
      <FormGuideLines />
      <FormDecorativeRail className="absolute top-6 left-2.5 hidden sm:flex" />

      <div className="relative flex flex-col gap-[18px]">
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className={LABEL_CLASS}>
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className={LABEL_CLASS}>
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="workEmail" className={LABEL_CLASS}>
            Work email
          </label>
          <input
            id="workEmail"
            name="workEmail"
            type="email"
            autoComplete="email"
            required
            className={INPUT_CLASS}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="dataType" className={LABEL_CLASS}>
            What kind of data does your company have?
          </label>
          <div className="relative">
            <select
              id="dataType"
              name="dataType"
              required
              defaultValue=""
              className={SELECT_CLASS}
            >
              <option value="" disabled>
                Select a data type
              </option>
              {DATA_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#a8a8a8]" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="companyName" className={LABEL_CLASS}>
            Company name
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            autoComplete="organization"
            required
            className={INPUT_CLASS}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="companySize" className={LABEL_CLASS}>
            Company size
          </label>
          <div className="relative">
            <select
              id="companySize"
              name="companySize"
              required
              defaultValue=""
              className={SELECT_CLASS}
            >
              <option value="" disabled>
                Select company size
              </option>
              {COMPANY_SIZE_OPTIONS.map((option) => (
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
          className="group relative mt-1.5 flex h-[42px] w-full items-center justify-center overflow-hidden bg-[#141518] font-serif text-sm tracking-wide text-white uppercase transition-transform duration-150 ease-snap active:scale-[0.98]"
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
