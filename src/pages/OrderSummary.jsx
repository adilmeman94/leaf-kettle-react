import { useStore } from "../context/StoreContext";
import { findById } from "../data/products";
import { money } from "../utils/format";

export default function OrderSummary() {
  const { cart, totals } = useStore();
  return (
    <aside className="summary" aria-label="Order summary">
      <h2>Summary</h2>
      {cart.map(l => { const p = findById(l.id); return <div key={l.id} className="sum-row"><span>{l.quantity} × {p.name}</span><span>{money(p.price * l.quantity)}</span></div>; })}
      <hr />
      <div className="sum-row"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
      {totals.discount > 0 && <div className="sum-row"><span>Discount ({totals.coupon})</span><span>−{money(totals.discount)}</span></div>}
      <div className="sum-row"><span>Shipping</span><span>{totals.shipping ? money(totals.shipping) : "Free"}</span></div>
      <div className="sum-row"><span>GST 5%</span><span>{money(totals.tax)}</span></div>
      <div className="sum-row total"><span>Total</span><span>{money(totals.total)}</span></div>
    </aside>
  );
}
