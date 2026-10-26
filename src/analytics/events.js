/**
 * Named GA4 recommended events. Pages call these, never dlPush directly.
 * Item schema: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */
import { pushEcommerce, pushEvent } from "./dataLayer";
import { BRAND, CURRENCY, categoryName, findById } from "../data/products";

/** Product -> GA4 item */
export function toItem(product, extra = {}) {
  return {
    item_id: product.id,
    item_name: product.name,
    item_brand: BRAND,
    item_category: categoryName(product.category),
    item_variant: product.variant,
    price: product.price,
    quantity: 1,
    ...extra
  };
}

/** Cart lines [{id, quantity}] -> GA4 items */
export function cartToItems(lines, coupon) {
  return lines.map((l, index) =>
    toItem(findById(l.id), { quantity: l.quantity, index, ...(coupon ? { coupon } : {}) })
  );
}
const sum = items => items.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

// ---------- page ----------
export const pageView = ({ path, title, location, referrer, pageType }) =>
  pushEvent("page_view", { page_path: path, page_title: title, page_location: location, page_referrer: referrer, page_type: pageType });

// ---------- discovery ----------
export const viewItemList = (list, products) =>
  pushEcommerce("view_item_list", {
    item_list_id: list.id,
    item_list_name: list.name,
    items: products.map((p, index) => toItem(p, { index, item_list_id: list.id, item_list_name: list.name }))
  });

export const selectItem = (list, product, index) =>
  pushEcommerce("select_item", {
    item_list_id: list.id,
    item_list_name: list.name,
    items: [toItem(product, { index, item_list_id: list.id, item_list_name: list.name })]
  });

export const viewItem = (product, list) =>
  pushEcommerce("view_item", {
    currency: CURRENCY,
    value: product.price,
    items: [toItem(product, list ? { item_list_id: list.id, item_list_name: list.name } : {})]
  });

export const viewPromotion = (promo, products) =>
  pushEcommerce("view_promotion", { ...promo, items: products.map((p, index) => toItem(p, { index, ...promo })) });

export const selectPromotion = (promo, products) =>
  pushEcommerce("select_promotion", { ...promo, items: products.map((p, index) => toItem(p, { index, ...promo })) });

export const search = term => pushEvent("search", { search_term: term });

// ---------- cart & wishlist ----------
export const addToCart = (product, quantity, list) => {
  const items = [toItem(product, { quantity, ...(list ? { item_list_id: list.id, item_list_name: list.name } : {}) })];
  return pushEcommerce("add_to_cart", { currency: CURRENCY, value: sum(items), items });
};

export const removeFromCart = (product, quantity) => {
  const items = [toItem(product, { quantity })];
  return pushEcommerce("remove_from_cart", { currency: CURRENCY, value: sum(items), items });
};

export const addToWishlist = product =>
  pushEcommerce("add_to_wishlist", { currency: CURRENCY, value: product.price, items: [toItem(product)] });

export const viewCart = lines => {
  const items = cartToItems(lines);
  return pushEcommerce("view_cart", { currency: CURRENCY, value: sum(items), items });
};

// ---------- checkout ----------
export const beginCheckout = (lines, coupon) => {
  const items = cartToItems(lines, coupon);
  return pushEcommerce("begin_checkout", { currency: CURRENCY, value: sum(items), ...(coupon ? { coupon } : {}), items });
};

export const addShippingInfo = (lines, shippingTier, coupon) => {
  const items = cartToItems(lines, coupon);
  return pushEcommerce("add_shipping_info", { currency: CURRENCY, value: sum(items), shipping_tier: shippingTier, ...(coupon ? { coupon } : {}), items });
};

export const addPaymentInfo = (lines, paymentType, value, coupon) =>
  pushEcommerce("add_payment_info", { currency: CURRENCY, value, payment_type: paymentType, ...(coupon ? { coupon } : {}), items: cartToItems(lines, coupon) });

export const purchase = order =>
  pushEcommerce("purchase", {
    transaction_id: order.id,
    affiliation: "Leaf & Kettle web store",
    value: order.value,          // item revenue after discount, excl. tax & shipping
    tax: order.tax,
    shipping: order.shipping,
    currency: CURRENCY,
    ...(order.coupon ? { coupon: order.coupon } : {}),
    items: cartToItems(order.lines, order.coupon)
  }, { payment_type: order.paymentType, shipping_tier: order.shippingTier, customer_type: order.customerType });

export const refund = order =>
  pushEcommerce("refund", { transaction_id: order.id, currency: CURRENCY, value: order.value, items: cartToItems(order.lines) });

// ---------- user ----------
export const login = method => pushEvent("login", { method });
export const signUp = method => pushEvent("sign_up", { method });
export const logout = () => pushEvent("logout");
export const generateLead = (formName, topic) => pushEvent("generate_lead", { form_name: formName, lead_topic: topic, currency: CURRENCY, value: 0 });
