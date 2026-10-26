import { Link, Navigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { findById } from "../data/products";
import { money } from "../utils/format";

export default function Account() {
  const { user, orders, refundOrder } = useStore();
  if (!user) return <Navigate to="/login" replace state={{ from: "/account" }} />;

  return (
    <section className="section narrow">
      <h1 className="h1">Hi {user.name.split(" ")[0]}</h1>
      <p className="muted">{user.email}</p>
      <h2>Your orders</h2>
      {orders.length === 0 && <p className="muted">No orders yet. <Link to="/shop">Start shopping</Link>.</p>}
      <ul className="orders">
        {orders.map(o => (
          <li key={o.id} className="order">
            <div>
              <strong>{o.id}</strong> <span className={"badge " + o.status}>{o.status}</span>
              <div className="muted">{new Date(o.date).toLocaleDateString("en-IN")}, {o.lines.map(l => `${l.quantity} × ${findById(l.id).name}`).join(", ")}</div>
            </div>
            <div className="row tight">
              <span className="price">{money(o.total)}</span>
              {o.status === "placed" && <button className="btn small" onClick={() => refundOrder(o)}>Request refund</button>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
