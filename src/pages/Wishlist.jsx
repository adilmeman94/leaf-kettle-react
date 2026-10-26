import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { useStore } from "../context/StoreContext";
import { findById } from "../data/products";

export default function Wishlist() {
  const { wishlist } = useStore();
  const products = wishlist.map(findById).filter(Boolean);
  return (
    <section className="section">
      <h1 className="h1">Wishlist</h1>
      {products.length
        ? <ProductGrid list={{ id: "wishlist", name: "Wishlist" }} products={products} />
        : <div className="empty"><p className="muted">Tap the heart on any tea to save it here.</p><Link to="/shop" className="btn">Browse teas</Link></div>}
    </section>
  );
}
