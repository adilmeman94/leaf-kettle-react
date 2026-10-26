import { Link, useNavigate } from "react-router-dom";
import ProductArt from "../components/ProductArt";
import QtyStepper from "../components/QtyStepper";
import CheckoutSteps from "../components/CheckoutSteps";
import { useStore } from "../context/StoreContext";
import useTrackOnce from "../analytics/useTrackOnce";
import { beginCheckout, viewCart } from "../analytics/events";
import { findById } from "../data/products";
import { money } from "../utils/format";

export default function Cart() {
  const { cart, totals, addToCart, removeFromCart } = useStore();
  const navigate = useNavigate();

  // view_cart fires once per visit to the cart page, with the cart as it was on arrival.
  useTrackOnce("view_cart", () => viewCart(cart), cart.length > 0);

  if (!cart.length) return (
    <section className="section empty">
      <h1 className="h1">Your cart is empty</h1>
      <p className="muted">Add a tea to start checkout.</p>
      <Link to="/shop" className="btn solid">Browse teas</Link>
    </section>
  );

  const checkout = () => { beginCheckout(cart, totals.coupon); navigate("/checkout"); };

  return (
    <section className="section narrow">
      <CheckoutSteps current="Cart" />
      <h1 className="h1">Cart</h1>
      <ul className="lines">
        {cart.map(l => {
          const p = findById(l.id);
          return (
            <li key={l.id} className="line">
              <ProductArt product={p} className="thumb" />
              <div><Link to={`/product/${p.slug}`}><strong>{p.name}</strong></Link><div className="muted">{money(p.price)} each</div></div>
              <QtyStepper value={l.quantity} onDec={() => removeFromCart(p, 1)} onInc={() => addToCart(p, 1)} label={`${p.name} quantity`} />
              <button className="link" onClick={() => removeFromCart(p)}>Remove</button>
            </li>
          );
        })}
      </ul>
      <div className="sum"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
      <div className="row"><button className="btn solid" onClick={checkout}>Check out</button><Link to="/shop" className="btn">Keep shopping</Link></div>
    </section>
  );
}
