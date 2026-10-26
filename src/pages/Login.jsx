import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

// Fake auth for practice: any email + password signs you in. Nothing is sent anywhere.
export default function Login({ mode = "login" }) {
  const isNew = mode === "signup";
  const { user, signIn } = useStore();
  const navigate = useNavigate();
  const from = useLocation().state?.from || "/account";
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  if (user) return <Navigate to="/account" replace />;

  const set = k => e => setF(x => ({ ...x, [k]: e.target.value }));
  const submit = e => { e.preventDefault(); signIn(f, isNew); navigate(from, { replace: true }); };

  return (
    <section className="section narrow">
      <h1 className="h1">{isNew ? "Create account" : "Sign in"}</h1>
      <form className="form" onSubmit={submit}>
        {isNew && <label>Name<input required value={f.name} onChange={set("name")} autoComplete="name" /></label>}
        <label>Email<input required type="email" value={f.email} onChange={set("email")} autoComplete="email" /></label>
        {isNew && <label>Phone<input type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" /></label>}
        <label>Password<input required type="password" minLength={4} value={f.password} onChange={set("password")} autoComplete={isNew ? "new-password" : "current-password"} /></label>
        <button className="btn solid">{isNew ? "Create account" : "Sign in"}</button>
      </form>
      <p className="muted">{isNew ? <>Have an account? <Link to="/login">Sign in</Link></> : <>New here? <Link to="/signup">Create an account</Link></>}</p>
    </section>
  );
}
