// SHA-256 helpers for user-provided data (enhanced conversions / CAPI matching).
export async function sha256(value) {
  if (!value || !window.crypto?.subtle) return undefined;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
export const normalizeEmail = e => (e || "").trim().toLowerCase();
// Indian numbers: keep digits, prefix 91 for 10-digit numbers (E.164 without +)
export const normalizePhone = p => {
  let d = (p || "").replace(/\D/g, "");
  if (d.length === 10) d = "91" + d;
  return d;
};
