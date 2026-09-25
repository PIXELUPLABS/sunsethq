"use client";

import dynamic from "next/dynamic";
import { getCalBookingConfig } from "../lib/cal-booking";

function CalBookingUnavailable() {
  return (
    <p role="status" className="mt-6 px-3 text-center text-sm text-[#727272]">
      Calendar couldn&rsquo;t load. Use the booking link below to choose a time.
    </p>
  );
}

const CalBooking = dynamic(
  () => import("./cal-booking").then((module) => module.CalBooking).catch(() => CalBookingUnavailable),
  {
    loading: () => <div role="status" className="mt-6 flex min-h-[560px] items-center justify-center p-8 text-sm text-[#727272]">Loading available times…</div>,
  },
);

/** Keeps the accepted result and direct link available independently of the calendar chunk. */
export function BookingResult({ bookingUrl, email, submissionId }: { bookingUrl: string; email: string; submissionId?: string }) {
  return (
    <section aria-labelledby="booking-title" className="relative min-w-0 bg-white px-3 py-8 shadow-[0_8px_28px_-10px_rgba(20,21,24,0.10)] sm:px-6 sm:pt-12">
      <div className="px-3 text-center">
        <h2 id="booking-title" className="font-serif text-2xl text-black">Let&rsquo;s talk about your data.</h2>
        <p className="mx-auto mt-3 max-w-[360px] text-sm leading-[1.5] text-[#727272]">
          Thanks for sharing. Choose a time to explore what your data could be worth with our team.
        </p>
      </div>
      <CalBooking bookingUrl={bookingUrl} email={email} submissionId={submissionId} />
      <p className="mt-4 px-3 text-center text-sm text-[#727272]">
        <a href={getCalBookingConfig(bookingUrl, email, submissionId).bookingUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors hover:text-black">
          Open calendar in a new tab
        </a>
      </p>
    </section>
  );
}
