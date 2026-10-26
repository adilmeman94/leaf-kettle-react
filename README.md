# Leaf & Kettle (React): dataLayer-only practice store

A multi-page React + React Router ecommerce site that pushes **GA4 recommended ecommerce events to `window.dataLayer`**. It is meant for learning Google Tag Manager.

It contains **no GTM, GA4, or Meta code**. You add your own container snippet and build your tags on top.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production files in dist/
```

Requires Node 18+.

## Add your GTM container

Open `index.html`. There are two marked spots:

1. **`<head>`**: paste the GTM head snippet below the `window.dataLayer = window.dataLayer || []` line.
2. **`<body>`**: paste the `<noscript>` iframe snippet.

That's the only file you need to touch for GTM. Everything else is already pushing to the dataLayer.

## Pages and routes

| Route | Page | Events pushed |
|---|---|---|
| `/` | Home: hero promo, promo strip, best sellers, categories | `view_promotion` ×2, `view_item_list`, `select_promotion`, `select_item` |
| `/shop`, `/shop/:category` | Category listing with sort | `view_item_list` (re-fires on sort, since the order changes), `select_item` |
| `/product/:slug` | Product detail + related products | `view_item`, `add_to_cart`, `add_to_wishlist`, `view_item_list` (related) |
| `/search?q=` | Search results | `search`, `view_item_list` |
| `/cart` | Cart with quantity steppers | `view_cart`, `add_to_cart`, `remove_from_cart`, `begin_checkout` |
| `/checkout` | Shipping form | `add_shipping_info` |
| `/checkout/payment` | Payment + coupon (`FIRSTCUP`, `CHAI20`) | `add_payment_info`, `purchase` |
| `/order/:id` | Confirmation (no event, so refresh never duplicates purchase) | |
| `/wishlist` | Saved items | `view_item_list` |
| `/login`, `/signup` | Fake auth (any email works) | `login`, `sign_up` |
| `/account` | Order history + refund button | `refund`, header `logout` |
| `/contact` | Contact form | `generate_lead` |
| `*` | 404 | |

**Every route change** pushes a virtual `page_view`. It includes `page_path`, `page_title`, `page_location`, `page_referrer` and `page_type`.

## What each push looks like

```js
{ ecommerce: null }                        // cleared before every ecommerce event
{
  event: "add_to_cart",
  event_id: "3f6c...",                     // unique per push; reuse as Meta eventID for dedup
  ecommerce: {
    currency: "INR",
    value: 798,
    items: [{ item_id: "LK-004", item_name: "Masala Chai Blend", item_brand: "Leaf & Kettle",
              item_category: "Blends", item_variant: "250g", price: 399, quantity: 2,
              item_list_id: "home_bestsellers", item_list_name: "Home best sellers" }]
  },
  user_data: {                             // only once the user signs in or fills the shipping form
    user_id: "U123456", logged_in: true,
    sha256_email_address: "…", sha256_phone_number: "…",
    address: { city: "ahmedabad", postal_code: "380001", country: "IN" }
  }
}
```

`purchase` also carries `transaction_id`, `tax`, `shipping`, `coupon`, `affiliation`, plus top-level `payment_type`, `shipping_tier` and `customer_type` (new / returning).

Email and phone are normalized (lowercase email; phone becomes `91XXXXXXXXXX`), then SHA-256 hashed in the browser. Raw values never enter the dataLayer.

## Where the code lives

```
src/analytics/dataLayer.js     the only file that touches window.dataLayer
src/analytics/events.js        one function per GA4 event (viewItem, addToCart, purchase…)
src/analytics/RouteTracker.jsx virtual page_view on every route change
src/analytics/useTrackOnce.js  stops duplicate pushes on re-render
src/context/StoreContext.jsx   cart, wishlist, user, orders (saved in localStorage)
src/data/products.js           catalog, categories, coupons, promotions
src/pages/*                    one file per page
src/components/*               header, product card/grid, steppers, etc.
```

To add a new event, write a function in `events.js` and call it from the page.

## Event order

`page_view` always lands first, then page-level events (`view_item`, `search`, `view_cart`, `view_promotion`), then list impressions (`view_item_list`). This matters if your GTM tags depend on page data.

React `StrictMode` is deliberately off, because it double-fires effects in development.

## Seeing pushes without GTM

Add `?dl=1` to any URL to open a small on-page dataLayer viewer. Add `?dl=0` to hide it. You can also type `dataLayer` in the browser console.

To remove the viewer entirely, delete `src/components/DataLayerInspector.jsx` and its line in `App.jsx`.

## Deploy

Because this is a single-page app, every route must serve `index.html`.

- **Vercel**: import the repo. `vercel.json` already has the rewrite. Build `npm run build`, output `dist`.
- **Netlify**: build `npm run build`, publish `dist`. `public/_redirects` handles routes.
- **GitHub Pages**: deep links 404 on refresh. Either switch `BrowserRouter` to `HashRouter` in `src/main.jsx`, or copy `dist/index.html` to `dist/404.html` after building.

## Before using on a real site

This is a learning project. On a real store you would add:

- a consent banner with Google Consent Mode v2, which GDPR/DPDP require before tags fire
- a real backend for auth, orders and payments
- purchase deduplication on the server side
