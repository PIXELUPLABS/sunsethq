/* Independent of React/Next bootstrap: still runs when application chunks fail. */
(() => {
  if (window.__replaySignupMonitor) return;
  window.__replaySignupMonitor = true;
  const sent = new Set();
  const active = () => /^\/value-my-data\/?$/.test(location.pathname);
  const report = code => {
    if (!active() || sent.has(code)) return;
    sent.add(code);
    try {
      window.__replaySignupPageId ??= crypto.randomUUID();
      void fetch("/api/signup-signal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: window.__replaySignupPageId, code }), keepalive: true,
      }).catch(() => {});
    } catch { /* Do not affect the form. */ }
  };
  window.addEventListener("error", event => {
    if (event instanceof ErrorEvent || event.target instanceof HTMLScriptElement) report("javascript_error");
  }, true);
  window.addEventListener("unhandledrejection", () => report("javascript_error"));
  setTimeout(() => {
    if (active() && !window.__replaySignupReady) report("bootstrap_timeout");
  }, 25000);
})();
