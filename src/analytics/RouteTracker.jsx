import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { pageView } from "./events";
import { categoryName, findBySlug } from "../data/products";

/** Works out page type + title from the URL. */
function describe(pathname) {
  const p = pathname.split("/").filter(Boolean);
  if (p.length === 0) return { type: "home", title: "Leaf & Kettle | Single-estate Indian tea" };
  switch (p[0]) {
    case "shop": return { type: "category", title: (p[1] ? categoryName(p[1]) : "All teas") + " | Leaf & Kettle" };
    case "product": return { type: "product", title: (findBySlug(p[1])?.name || "Product") + " | Leaf & Kettle" };
    case "search": return { type: "search", title: "Search | Leaf & Kettle" };
    case "cart": return { type: "cart", title: "Cart | Leaf & Kettle" };
    case "checkout": return { type: p[1] === "payment" ? "checkout_payment" : "checkout_shipping", title: "Checkout | Leaf & Kettle" };
    case "order": return { type: "order_confirmation", title: "Order placed | Leaf & Kettle" };
    case "wishlist": return { type: "wishlist", title: "Wishlist | Leaf & Kettle" };
    case "login": return { type: "login", title: "Sign in | Leaf & Kettle" };
    case "signup": return { type: "signup", title: "Create account | Leaf & Kettle" };
    case "account": return { type: "account", title: "Your orders | Leaf & Kettle" };
    case "contact": return { type: "contact", title: "Contact | Leaf & Kettle" };
    default: return { type: "not_found", title: "Page not found | Leaf & Kettle" };
  }
}

/**
 * Pushes a virtual page_view on every route change.
 * Uses a layout effect and is rendered BEFORE <Routes> in App.jsx, so it runs before page-level
 * ecommerce effects: page_view always comes first in the dataLayer.
 */
export default function RouteTracker() {
  const location = useLocation();
  const prevUrl = useRef(document.referrer || "");
  const lastKey = useRef(null);

  useLayoutEffect(() => {
    const key = location.pathname + location.search;
    if (lastKey.current === key) return;
    lastKey.current = key;

    const { type, title } = describe(location.pathname);
    document.title = title;
    pageView({ path: key, title, location: window.location.href, referrer: prevUrl.current, pageType: type });
    prevUrl.current = window.location.href;
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return null;
}
