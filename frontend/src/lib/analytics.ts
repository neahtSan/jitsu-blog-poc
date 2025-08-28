declare global {
  interface Jitsu {
	track: (event: string, payload?: Record<string, unknown>) => void;
	identify: (userId: string, traits?: Record<string, unknown>) => void;
  }
  interface Window { jitsu?: Jitsu }
}


const WRITE_KEY = import.meta.env.VITE_JITSU_WRITE_KEY as string | undefined;
const JITSU_HOST = (import.meta.env.VITE_JITSU_HOST as string | undefined) || "https://t.jitsu.com"; // default cloud collector


export function initAnalytics() {
if (!WRITE_KEY) {
console.warn("Jitsu not configured: set VITE_JITSU_WRITE_KEY to enable analytics.");
return;
}
if (window.jitsu) return; // already loaded


const s = document.createElement("script");
s.async = true;
s.src = `${JITSU_HOST.replace(/\/$/, "")}/s.js`;
s.dataset.writeKey = WRITE_KEY;
s.dataset.target = JITSU_HOST;
document.head.appendChild(s);
}


export function track(event: string, payload?: Record<string, unknown>) {
if (window.jitsu?.track) {
window.jitsu.track(event, payload || {});
} else {
// Quietly no-op; helpful in dev before keys are set
console.debug("[track noop]", event, payload);
}
}


export function identify(userId: string, traits?: Record<string, unknown>) {
if (window.jitsu?.identify) {
window.jitsu.identify(userId, traits || {});
} else {
console.debug("[identify noop]", userId, traits);
}
}
