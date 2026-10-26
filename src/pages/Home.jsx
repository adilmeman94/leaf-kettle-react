import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import useTrackOnce from "../analytics/useTrackOnce";
import { selectPromotion, viewPromotion } from "../analytics/events";
import { CATEGORIES, PRODUCTS, PROMOTIONS, findById } from "../data/products";

const HERO_PRODUCTS = [findById("LK-004"), findById("LK-007")];
const BESTSELLERS = PRODUCTS.filter(p => p.bestseller);

export default function Home() {
  useTrackOnce("home_promos", () => {
    viewPromotion(PROMOTIONS.hero, HERO_PRODUCTS);
    viewPromotion(PROMOTIONS.strip, []);
  });

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>Chai week: 10% off your first order</h1>
          <p>Use code FIRSTCUP at checkout. Our masala and rose chai blends are back in stock.</p>
          <Link to="/shop/blends" className="btn saffron" onClick={() => selectPromotion(PROMOTIONS.hero, HERO_PRODUCTS)}>
            Shop chai blends
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <svg viewBox="0 0 100 100"><path d="M50 10 C80 24 86 62 50 90 C14 62 20 24 50 10Z" fill="#1F4D45" /></svg>
        </div>
      </section>

      <Link to="/shop" className="strip" onClick={() => selectPromotion(PROMOTIONS.strip, [])}>
        Free standard shipping on every order. Browse all teas.
      </Link>

      <section className="section">
        <h2>Best sellers</h2>
        <ProductGrid list={{ id: "home_bestsellers", name: "Home best sellers" }} products={BESTSELLERS} />
      </section>

      <section className="section">
        <h2>Shop by category</h2>
        <div className="cat-tiles">
          {CATEGORIES.map(c => <Link key={c.slug} to={`/shop/${c.slug}`} className="cat-tile">{c.name}</Link>)}
        </div>
      </section>
    </>
  );
}
