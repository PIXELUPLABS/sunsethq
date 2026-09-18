export function checkLeadFallback(intake, delivery) {
  if (intake.vars.UNVERIFIED_LEADS_ENABLED !== "true") return;
  const limit = intake.ratelimits?.find(binding => binding.name === "UNVERIFIED_RATE_LIMITER");
  const email = delivery.send_email?.find(binding => binding.name === "LEAD_ALERT_EMAIL");
  if (!limit || limit.simple.limit > 2 || limit.simple.period !== 60 ||
      !delivery.vars.LEAD_ALERT_TO || !delivery.vars.LEAD_ALERT_FROM ||
      !email?.allowed_destination_addresses?.includes(delivery.vars.LEAD_ALERT_TO) ||
      !email?.allowed_sender_addresses?.includes(delivery.vars.LEAD_ALERT_FROM)) {
    throw new Error("Unverified submissions require the tighter rate limit and a restricted email sender before deployment.");
  }
}
