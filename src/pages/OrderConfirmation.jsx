import { Link, useParams } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import NotFound from "./NotFound";
import { useStore } from "../context/StoreContext";
import { findById } from "../data/products";
import { money } from "../utils/format";

// purchase is pushed when the order is placed (CheckoutPayment), NOT here,
// so refreshing this page never sends a duplicate purchase.
export default function OrderConfirmation() {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find(o => o.id === id);
  if (!order) return <NotFound />;

  return (
    <section className="section narrow">
      <CheckoutSteps current="Done" />
      <div className="panel">
        <h1 className="h1">Order placed</h1>
        <p>Order <strong>{order.id}</strong>. A confirmation would go to {order.email}.</p>
        <ul className="plain">
          {order.lines.map(l => { const p = findById(l.id); return <li key={l.id}>{l.quantity} × {p.name}</li>; })}
        </ul>
        <p className="price big">{money(order.total)}</p>
        <div className="row"><Link to="/shop" className="btn solid">Keep shopping</Link><Link to="/account" className="btn">View orders</Link></div>
      </div>
    </section>
  );
}
