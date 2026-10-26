import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductArt from "../components/ProductArt";
import ProductGrid from "../components/ProductGrid";
import QtyStepper from "../components/QtyStepper";
import NotFound from "./NotFound";
import { useStore } from "../context/StoreContext";
import useTrackOnce from "../analytics/useTrackOnce";
import { viewItem } from "../analytics/events";
import { PRODUCTS, categoryName, findBySlug } from "../data/products";
import { money } from "../utils/format";

export default function Product() {
  const { slug } = useParams();
  const { state } = useLocation();
  const product = findBySlug(slug);
  const list = state?.list;            // set by ProductCard when the user came from a list
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [qty, setQty] = useState(1);

  useTrackOnce(product ? product.id : null, () => { setQty(1); viewItem(product, list); });

  if (!product) return <NotFound />;
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id);
  const saved = wishlist.includes(product.id);

  return (
    <>
      <section className="pdp">
        <ProductArt product={product} className="pdp-art" />
        <div>
          <p className="muted">{categoryName(product.category)}, {product.variant}</p>
          <h1 className="h1">{product.name}</h1>
          <p>{product.desc}</p>
          <p className="price big">{money(product.price)}</p>
          <div className="row">
            <QtyStepper value={qty} onDec={() => setQty(q => Math.max(1, q - 1))} onInc={() => setQty(q => q + 1)} />
            <button className="btn solid" onClick={() => addToCart(product, qty, list)}>Add to cart</button>
            <button className="btn" onClick={() => toggleWishlist(product)}>{saved ? "Saved" : "Save to wishlist"}</button>
          </div>
          <p className="muted small">SKU {product.id}</p>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section">
          <h2>You may also like</h2>
          <ProductGrid list={{ id: "related_products", name: "Related products" }} products={related} />
        </section>
      )}
    </>
  );
}
