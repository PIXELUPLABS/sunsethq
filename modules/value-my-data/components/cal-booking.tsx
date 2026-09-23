"use client";

import Cal from "@calcom/embed-react";
import { useCalBooking } from "../hooks/use-cal-booking";
import { CAL_EMBED_NAMESPACE, CAL_EMBED_SCRIPT_URL } from "../lib/cal-booking";

export function CalBooking({ bookingUrl, email, submissionId }: { bookingUrl: string; email: string; submissionId?: string }) {
  const booking = useCalBooking(bookingUrl, email, submissionId);

  return (
    <>
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
    </>
  );
}
