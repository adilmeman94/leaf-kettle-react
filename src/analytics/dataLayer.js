/**
 * Low-level dataLayer helpers. This is the ONLY place that touches window.dataLayer.
 * No GTM, GA4 or Meta code lives in this project; add your own container snippet
 * in index.html and build tags/triggers on the events pushed from here.
 */
import { uid } from "../utils/format";

let currentUserData = null;      // set by StoreContext when the user signs in / checks out
const listeners = new Set();     // used only by the optional DataLayerInspector

export function setUserData(userData) {
  currentUserData = userData;
}

export function onPush(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function dlPush(obj) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(obj);
  listeners.forEach(fn => fn(obj));
}

/** Generic event. Every event gets an event_id you can reuse for Meta dedup. */
export function pushEvent(event, params = {}) {
  const payload = { event, event_id: uid(), ...params };
  if (currentUserData) payload.user_data = currentUserData;
  dlPush(payload);
  return payload.event_id;
}

/** GA4 ecommerce event. Clears the previous ecommerce object first, as Google recommends. */
export function pushEcommerce(event, ecommerce, params = {}) {
  dlPush({ ecommerce: null });
  return pushEvent(event, { ...params, ecommerce });
}
