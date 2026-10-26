import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import OrderSummary from "./OrderSummary";
import { useStore } from "../context/StoreContext";
import { addShippingInfo } from "../analytics/events";
import { SHIPPING } from "../data/products";
import { money } from "../utils/format";

export default function CheckoutShipping() {
  const { cart, user, checkout, setCheckout, totals } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: checkout.name || user?.name || "", email: checkout.email || user?.email || "",
    phone: checkout.phone || user?.phone || "", address: checkout.address || "",
    city: checkout.city || "", zip: checkout.zip || "", shippingTier: checkout.shippingTier || "Standard"
  });
  if (!cart.length) return <Navigate to="/cart" replace />;

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = e => {
    e.preventDefault();
    setCheckout(c => ({ ...c, ...form }));
    addShippingInfo(cart, form.shippingTier, totals.coupon);
    navigate("/checkout/payment");
  };

  return (
    <section className="section checkout">
      <div>
        <CheckoutSteps current="Shipping" />
        <h1 className="h1">Shipping</h1>
        <form className="form" onSubmit={submit}>
          <label>Full name<input required value={form.name} onChange={set("name")} autoComplete="name" /></label>
          <label>Email<input required type="email" value={form.email} onChange={set("email")} autoComplete="email" /></label>
          <label>Phone<input type="tel" value={form.phone} onChange={set("phone")} placeholder="98xxxxxxxx" autoComplete="tel" /></label>
          <label>Address<input required value={form.address} onChange={set("address")} autoComplete="street-address" /></label>
          <div className="two">
            <label>City<input required value={form.city} onChange={set("city")} autoComplete="address-level2" /></label>
            <label>PIN code<input required pattern="[0-9]{6}" title="6-digit PIN code" value={form.zip} onChange={set("zip")} autoComplete="postal-code" /></label>
          </div>
          <fieldset className="choices"><legend>Delivery</legend>
            {Object.entries(SHIPPING).map(([tier, cost]) => (
              <label key={tier}><input type="radio" name="tier" value={tier} checked={form.shippingTier === tier} onChange={set("shippingTier")} />
                {tier}, {cost ? money(cost) : "free"}</label>
            ))}
          </fieldset>
          <button className="btn solid">Continue to payment</button>
        </form>
      </div>
      <OrderSummary />
    </section>
  );
}
