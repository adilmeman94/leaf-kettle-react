import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { CATEGORIES } from "../data/products";

export default function Header() {
  const { totals, user, signOut, wishlist } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const submit = e => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  return (
    <header className="top">
      <div className="top-row">
        <Link to="/" className="brand">Leaf <span>&amp;</span> Kettle</Link>
        <form className="search" role="search" onSubmit={submit}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search teas" aria-label="Search products" />
        </form>
        <nav className="actions">
          <NavLink to="/wishlist" className="link">Wishlist{wishlist.length ? ` (${wishlist.length})` : ""}</NavLink>
          {user
            ? <><NavLink to="/account" className="link">{user.name.split(" ")[0]}</NavLink><button className="link" onClick={signOut}>Sign out</button></>
            : <NavLink to="/login" className="link">Sign in</NavLink>}
          <NavLink to="/cart" className="btn small solid">Cart <span className="count">{totals.count}</span></NavLink>
          <button className="link menu-btn" aria-expanded={open} onClick={() => setOpen(o => !o)}>Menu</button>
        </nav>
      </div>
      <nav className={"cats" + (open ? " open" : "")} aria-label="Categories">
        <NavLink to="/shop" end onClick={() => setOpen(false)}>All teas</NavLink>
        {CATEGORIES.map(c => <NavLink key={c.slug} to={`/shop/${c.slug}`} onClick={() => setOpen(false)}>{c.name}</NavLink>)}
        <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
      </nav>
    </header>
  );
}
