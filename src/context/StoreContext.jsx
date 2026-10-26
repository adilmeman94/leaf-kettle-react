import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { COUPONS, findById, SHIPPING, TAX_RATE } from "../data/products";
import { setUserData } from "../analytics/dataLayer";
import * as track from "../analytics/events";
import { normalizeEmail, normalizePhone, sha256 } from "../utils/hash";

const StoreContext = createContext(null);

function load(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load("lk_cart", []));          // [{ id, quantity }]
  const [wishlist, setWishlist] = useState(() => load("lk_wishlist", [])); // [id]
  const [user, setUser] = useState(() => load("lk_user", null));        // { id, name, email, phone }
  const [orders, setOrders] = useState(() => load("lk_orders", []));
  const [checkout, setCheckout] = useState(() => load("lk_checkout", {})); // shipping + coupon
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => save("lk_cart", cart), [cart]);
  useEffect(() => save("lk_wishlist", wishlist), [wishlist]);
  useEffect(() => save("lk_user", user), [user]);
  useEffect(() => save("lk_orders", orders), [orders]);
  useEffect(() => save("lk_checkout", checkout), [checkout]);

  // Keep hashed user_data in sync so every dataLayer push carries it once known.
  useEffect(() => {
    const email = user?.email || checkout.email;
    const phone = user?.phone || checkout.phone;
    if (!email) { setUserData(null); return; }
    let cancelled = false;
    (async () => {
      const data = {
        user_id: user?.id,
        logged_in: !!user,
        sha256_email_address: await sha256(normalizeEmail(email)),
        sha256_phone_number: phone ? await sha256(normalizePhone(phone)) : undefined,
        address: checkout.city ? { city: checkout.city.trim().toLowerCase(), postal_code: checkout.zip, country: "IN" } : undefined
      };
      Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);
      if (!cancelled) setUserData(data);
    })();
    return () => { cancelled = true; };
  }, [user, checkout.email, checkout.phone, checkout.city, checkout.zip]);

  const toast = msg => { setToastMsg(msg); clearTimeout(window.__lkToast); window.__lkToast = setTimeout(() => setToastMsg(""), 2000); };

  // ---------- cart ----------
  const addToCart = (product, quantity = 1, list) => {
    setCart(c => {
      const line = c.find(l => l.id === product.id);
      return line ? c.map(l => l.id === product.id ? { ...l, quantity: l.quantity + quantity } : l) : [...c, { id: product.id, quantity }];
    });
    track.addToCart(product, quantity, list);
    toast(`Added ${quantity} × ${product.name}`);
  };

  const removeFromCart = (product, quantity) => {
    const line = cart.find(l => l.id === product.id);
    if (!line) return;
    const q = Math.min(quantity ?? line.quantity, line.quantity);
    setCart(c => c.flatMap(l => l.id !== product.id ? [l] : l.quantity - q > 0 ? [{ ...l, quantity: l.quantity - q }] : []));
    track.removeFromCart(product, q);
  };

  // ---------- wishlist ----------
  const toggleWishlist = product => {
    if (wishlist.includes(product.id)) {
      setWishlist(w => w.filter(id => id !== product.id));
      toast("Removed from wishlist");
    } else {
      setWishlist(w => [...w, product.id]);
      track.addToWishlist(product);
      toast("Saved to wishlist");
    }
  };

  // ---------- totals ----------
  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, l) => s + findById(l.id).price * l.quantity, 0);
    const coupon = checkout.coupon && COUPONS[checkout.coupon] ? checkout.coupon : "";
    const discount = coupon ? Math.round(subtotal * COUPONS[coupon]) : 0;
    const shipping = SHIPPING[checkout.shippingTier] ?? 0;
    const value = subtotal - discount;
    const tax = Math.round(value * TAX_RATE);
    return { subtotal, coupon, discount, shipping, value, tax, total: value + tax + shipping, count: cart.reduce((s, l) => s + l.quantity, 0) };
  }, [cart, checkout.coupon, checkout.shippingTier]);

  // ---------- order ----------
  const placeOrder = paymentType => {
    const order = {
      id: "LK-" + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      lines: cart,
      value: totals.value, tax: totals.tax, shipping: totals.shipping, total: totals.total,
      coupon: totals.coupon || undefined,
      paymentType, shippingTier: checkout.shippingTier,
      customerType: orders.length ? "returning" : "new",
      email: user?.email || checkout.email,
      status: "placed"
    };
    track.purchase(order);
    setOrders(o => [order, ...o]);
    setCart([]);
    setCheckout(c => ({ ...c, coupon: "" }));
    return order;
  };

  const refundOrder = order => {
    track.refund(order);
    setOrders(o => o.map(x => x.id === order.id ? { ...x, status: "refunded" } : x));
    toast("Refund requested");
  };

  // ---------- auth (fake, local only) ----------
  const signIn = (u, isNew) => {
    const next = { id: u.id || "U" + Date.now().toString().slice(-6), name: u.name || u.email.split("@")[0], email: u.email, phone: u.phone || "" };
    setUser(next);
    isNew ? track.signUp("email") : track.login("email");
    toast(isNew ? "Account created" : "Signed in");
  };
  const signOut = () => { track.logout(); setUser(null); toast("Signed out"); };

  const value = { cart, wishlist, user, orders, checkout, setCheckout, totals, toastMsg, toast,
    addToCart, removeFromCart, toggleWishlist, placeOrder, refundOrder, signIn, signOut };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
