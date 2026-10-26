import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="section empty">
      <h1 className="h1">Page not found</h1>
      <p className="muted">The link may be old. Head back to the shop.</p>
      <Link to="/shop" className="btn solid">Browse teas</Link>
    </section>
  );
}
