import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import NotFound from "./NotFound";
import { CATEGORIES, PRODUCTS, categoryName } from "../data/products";

const SORTS = {
  featured: { label: "Featured", fn: () => 0 },
  "price-asc": { label: "Price, low to high", fn: (a, b) => a.price - b.price },
  "price-desc": { label: "Price, high to low", fn: (a, b) => b.price - a.price }
};

export default function Shop() {
  const { category } = useParams();
  const [sort, setSort] = useState("featured");
  const valid = !category || CATEGORIES.some(c => c.slug === category);

  const products = useMemo(() =>
    PRODUCTS.filter(p => !category || p.category === category).slice().sort(SORTS[sort].fn),
  [category, sort]);

  if (!valid) return <NotFound />;
  const title = category ? categoryName(category) : "All teas";
  // Sorting changes the order, so it's a new list impression with its own index values.
  const list = { id: `category_${category || "all"}_${sort}`, name: `${title} (${SORTS[sort].label})` };

  return (
    <section className="section">
      <div className="list-head">
        <div><h1 className="h1">{title}</h1><p className="muted">{products.length} products</p></div>
        <label className="sort">Sort
          <select value={sort} onChange={e => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        </label>
      </div>
      <ProductGrid list={list} products={products} />
    </section>
  );
}
