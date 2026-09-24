import { hasPerformanceConsent, subscribeToConsent } from "@/modules/consent/lib/cookie-consent";

export function isAnalyticsEndpoint(input: string | URL, origin: string) {
  const url = new URL(input, origin);
  return url.pathname === "/cdn-cgi/rum" &&
    (url.origin === origin || url.origin === "https://cloudflareinsights.com");
}

let installed = false;
let withdrawn = false;
let script: HTMLScriptElement | undefined;

// Removing a script cannot remove its listeners. Keep these narrow guards for
// the document's lifetime, checking fresh consent at *send* time (also expiry,
// another tab, GPC, and late responses). Other application traffic is untouched.
function installTransportGuards() {
  if (installed) return;
  installed = true;
  const blocked = (url: string | URL) => {
    if (!isAnalyticsEndpoint(url, location.origin)) return false;
    const consent = hasPerformanceConsent();
    if (script && !consent) withdrawn = true;
    return withdrawn || !consent;
  };
  const sendBeacon = navigator.sendBeacon.bind(navigator);
  navigator.sendBeacon = (url, data) => blocked(url) ? false : sendBeacon(url, data);
  const fetch = window.fetch.bind(window);
  window.fetch = (input, init) => blocked(input instanceof Request ? input.url : input)
    ? Promise.resolve(new Response(null, { status: 204 })) : fetch(input, init);
  const targets = new WeakMap<XMLHttpRequest, string | URL>();
  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
    targets.set(this, url);
    open.call(this, method, url, async, username, password);
  };
  XMLHttpRequest.prototype.send = function (body) {
    const url = targets.get(this);
    if (url && blocked(url)) { this.abort(); return; }
    send.call(this, body);
  };
}

export function startCloudflareAnalytics(token: string) {
  if (location.origin !== "https://www.replay.ai") return () => {};
  if (!/^[a-f0-9]{32}$/i.test(token)) return () => {};
  installTransportGuards();
  const sync = () => {
    if (script && !hasPerformanceConsent()) withdrawn = true;
    if (!hasPerformanceConsent() || withdrawn || script) return;
    script = document.createElement("script");
    script.type = "module";
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.dataset.cfBeacon = JSON.stringify({ token, spa: true });
    document.head.append(script);
  };
  sync();
  return subscribeToConsent(sync);
}
