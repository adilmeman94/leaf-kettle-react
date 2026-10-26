import { Link, useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import useTrackOnce from "../analytics/useTrackOnce";
import { search } from "../analytics/events";
import { PRODUCTS, categoryName } from "../data/products";

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const results = q ? PRODUCTS.filter(p => (p.name + " " + categoryName(p.category) + " " + p.desc).toLowerCase().includes(q.toLowerCase())) : [];

  useTrackOnce(q || null, () => search(q));

  return (
    <section className="section">
      <h1 className="h1">{q ? `Results for "${q}"` : "Search"}</h1>
      <p className="muted">{results.length} products</p>
      {results.length
        ? <ProductGrid list={{ id: "search_results", name: "Search results" }} products={results} />
        : <div className="empty"><p>No teas match that. Try "chai", "green", or "kettle".</p><Link to="/shop" className="btn">Browse all teas</Link></div>}
    </section>
  );
}
