import { probeSignup } from "./signup-browser-probe.mjs";

await probeSignup({
  origin: process.env.SIGNUP_PROBE_ORIGIN ?? "https://www.replay.ai",
  secret: process.env.SIGNUP_PROBE_SECRET,
});
