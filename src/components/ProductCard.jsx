import { Link } from "react-router-dom";
import ProductArt from "./ProductArt";
import { useStore } from "../context/StoreContext";
import { selectItem } from "../analytics/events";
import { categoryName } from "../data/products";
import { money } from "../utils/format";

/** `list` = { id, name } of the list this card sits in; `index` = position in it. */
export default function ProductCard({ product, list, index }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const saved = wishlist.includes(product.id);
  const to = `/product/${product.slug}`;
  // list context travels to the product page via router state for view_item / add_to_cart
  const onSelect = () => selectItem(list, product, index);

  return (
    <article className="card">
      <Link to={to} state={{ list }} onClick={onSelect} className="card-art">
        <ProductArt product={product} />
      </Link>
      <div className="card-body">
        <Link to={to} state={{ list }} onClick={onSelect} className="card-title">{product.name}</Link>
        <div className="muted">{categoryName(product.category)}, {product.variant}</div>
        <div className="card-foot">
          <span className="price">{money(product.price)}</span>
          <div className="row tight">
            <button className="icon-btn" aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} onClick={() => toggleWishlist(product)}>
              {saved ? "♥" : "♡"}
            </button>
            <button className="btn small" onClick={() => addToCart(product, 1, list)}>Add to cart</button>
          </div>
        </div>
      </div>
    </article>
  );
}
