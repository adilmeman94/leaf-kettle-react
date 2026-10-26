export const CURRENCY = "INR";
export const BRAND = "Leaf & Kettle";
export const COUPONS = { FIRSTCUP: 0.1, CHAI20: 0.2 };
export const SHIPPING = { Standard: 0, Express: 99 };
export const TAX_RATE = 0.05;

export const CATEGORIES = [
  { slug: "black-tea", name: "Black Tea" },
  { slug: "green-tea", name: "Green Tea" },
  { slug: "blends", name: "Blends" },
  { slug: "teaware", name: "Teaware" }
];

export const PRODUCTS = [
  { id: "LK-001", slug: "assam-breakfast", name: "Assam Breakfast", category: "black-tea", variant: "250g", price: 449, color: "#7A3B1E", accent: "#E8A33D", bestseller: true,
    desc: "Malty, brisk, and built for milk and sugar. Grown in the Brahmaputra valley." },
  { id: "LK-002", slug: "darjeeling-first-flush", name: "Darjeeling First Flush", category: "black-tea", variant: "100g", price: 899, color: "#C98A3C", accent: "#FBFAF6", bestseller: true,
    desc: "Light, floral, and muscatel. Picked in early spring on high estates." },
  { id: "LK-003", slug: "kashmiri-kahwa", name: "Kashmiri Kahwa", category: "green-tea", variant: "100g", price: 599, color: "#5E7F3A", accent: "#E8A33D",
    desc: "Green tea with saffron, cardamom, cinnamon, and almond." },
  { id: "LK-004", slug: "masala-chai-blend", name: "Masala Chai Blend", category: "blends", variant: "250g", price: 399, color: "#9C4A23", accent: "#F4D9A6", bestseller: true,
    desc: "CTC Assam with ginger, clove, black pepper, and green cardamom." },
  { id: "LK-005", slug: "nilgiri-frost", name: "Nilgiri Frost", category: "black-tea", variant: "100g", price: 549, color: "#2F5D6B", accent: "#D7E3DB",
    desc: "Winter-picked, bright and fragrant. Very good iced." },
  { id: "LK-006", slug: "tulsi-green", name: "Tulsi Green", category: "green-tea", variant: "100g", price: 349, color: "#3E7A55", accent: "#FBFAF6",
    desc: "Holy basil with Assam green leaf. Calm, herbal, a little peppery." },
  { id: "LK-007", slug: "rose-chai", name: "Rose Chai", category: "blends", variant: "100g", price: 479, color: "#A3485A", accent: "#F4D9A6",
    desc: "Our masala chai softened with dried rose petals." },
  { id: "LK-008", slug: "brass-kettle", name: "Brass Tea Kettle", category: "teaware", variant: "1L", price: 1899, color: "#B8862E", accent: "#16201E",
    desc: "Hand-hammered brass with a tinned interior." },
  { id: "LK-009", slug: "kulhad-set", name: "Kulhad Cup Set", category: "teaware", variant: "Set of 6", price: 599, color: "#A55B35", accent: "#FBFAF6",
    desc: "Unglazed clay cups that add an earthy note to hot chai." }
];

export const categoryName = slug => CATEGORIES.find(c => c.slug === slug)?.name || slug;
export const findById = id => PRODUCTS.find(p => p.id === id);
export const findBySlug = slug => PRODUCTS.find(p => p.slug === slug);

export const PROMOTIONS = {
  hero: { promotion_id: "P_CHAI_WEEK", promotion_name: "Chai week", creative_name: "home_hero_saffron", creative_slot: "home_hero" },
  strip: { promotion_id: "P_FREE_SHIP", promotion_name: "Free standard shipping", creative_name: "home_strip", creative_slot: "home_strip" }
};
