import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="foot">
      <div><strong>Leaf &amp; Kettle</strong><p className="muted">A practice store for learning dataLayer tracking. Nothing here is for sale.</p></div>
      <nav className="foot-links">
        <Link to="/shop">Shop</Link><Link to="/account">Orders</Link><Link to="/contact">Contact</Link>
      </nav>
    </footer>
  );
}
