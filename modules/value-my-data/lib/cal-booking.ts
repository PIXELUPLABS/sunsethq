export const CAL_EMBED_SCRIPT_URL = "https://app.cal.com/embed/embed.js";
export const CAL_EMBED_NAMESPACE = "data-valuation";

export function getCalBookingConfig(bookingUrl: string, email: string) {
  const url = new URL(bookingUrl);
  url.searchParams.set("email", email);

  return {
    calOrigin: url.origin,
    calLink: url.pathname.replace(/^\//, ""),
    bookingUrl: url.href,
    config: {
      email,
      layout: "month_view" as const,
      theme: "light" as const,
      iframeAttrs: { title: "Book a data valuation call with Replay" },
    },
  };
}
