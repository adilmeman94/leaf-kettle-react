import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import OrderSummary from "./OrderSummary";
import { useStore } from "../context/StoreContext";
import { addPaymentInfo } from "../analytics/events";
import { COUPONS } from "../data/products";

const METHODS = ["UPI", "Card", "Net banking", "Cash on delivery"];

export default function CheckoutPayment() {
  const { cart, checkout, setCheckout, totals, placeOrder, toast } = useStore();
  const navigate = useNavigate();
  const [method, setMethod] = useState("UPI");
  const [code, setCode] = useState(checkout.coupon || "");
  const [placing, setPlacing] = useState(false);

  if (!cart.length && !placing) return <Navigate to="/cart" replace />;
  if (!checkout.email) return <Navigate to="/checkout" replace />;

  const applyCoupon = () => {
    const c = code.trim().toUpperCase();
    if (COUPONS[c]) { setCheckout(x => ({ ...x, coupon: c })); toast(`${c} applied`); }
    else { setCheckout(x => ({ ...x, coupon: "" })); toast("That code isn't valid. Try FIRSTCUP."); }
  };

  const submit = e => {
    e.preventDefault();
    setPlacing(true);
    addPaymentInfo(cart, method, totals.value, totals.coupon);
    const order = placeOrder(method);   // pushes purchase
    navigate(`/order/${order.id}`, { replace: true });
  };

  return (
    <section className="section checkout">
      <div>
        <CheckoutSteps current="Payment" />
        <h1 className="h1">Payment</h1>
        <p className="muted">Practice store: no payment is taken.</p>
        <form className="form" onSubmit={submit}>
          <fieldset className="choices"><legend>Pay with</legend>
            {METHODS.map(m => <label key={m}><input type="radio" name="pay" value={m} checked={method === m} onChange={() => setMethod(m)} />{m}</label>)}
          </fieldset>
          <div className="row">
            <label className="grow">Coupon<input value={code} onChange={e => setCode(e.target.value)} placeholder="FIRSTCUP" /></label>
            <button type="button" className="btn" onClick={applyCoupon}>Apply</button>
          </div>
          <button className="btn solid">Place order</button>
        </form>
      </div>
      <OrderSummary />
    </section>
  );
}
