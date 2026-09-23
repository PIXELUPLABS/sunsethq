"use client";

import Cal from "@calcom/embed-react";
import { useCalBooking } from "../hooks/use-cal-booking";
import { CAL_EMBED_NAMESPACE, CAL_EMBED_SCRIPT_URL } from "../lib/cal-booking";

export function CalBooking({ bookingUrl, email }: { bookingUrl: string; email: string }) {
  const booking = useCalBooking(bookingUrl, email);

  return (
    <section aria-labelledby="booking-title" className="relative min-w-0 bg-white px-3 py-8 shadow-[0_8px_28px_-10px_rgba(20,21,24,0.10)] sm:px-6 sm:pt-12">
      <div className="px-3 text-center">
        <h2 id="booking-title" className="font-serif text-2xl text-black">Let&rsquo;s talk about your data.</h2>
        <p className="mx-auto mt-3 max-w-[360px] text-sm leading-[1.5] text-[#727272]">
          Thanks for sharing. Choose a time to explore what your data could be worth with our team.
        </p>
      </div>
      {booking.status !== "ready" && (
        <p role="status" className="mt-6 px-3 text-center text-sm text-[#727272]">
          {booking.status === "loading" ? "Loading available times…" : "Calendar taking a while? Use the booking link below to choose a time."}
        </p>
      )}
      <Cal
        namespace={CAL_EMBED_NAMESPACE}
        calOrigin={booking.calOrigin}
        calLink={booking.calLink}
        config={booking.config}
        embedJsUrl={CAL_EMBED_SCRIPT_URL}
        className="mt-6 min-h-[560px] w-full overflow-auto"
      />
      <p className="mt-4 px-3 text-center text-sm text-[#727272]">
        <a href={booking.bookingUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors hover:text-black">
          Open calendar in a new tab
        </a>
      </p>
    </section>
  );
}
