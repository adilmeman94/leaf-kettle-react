const STEPS = ["Cart", "Shipping", "Payment", "Done"];
export default function CheckoutSteps({ current }) {
  const i = STEPS.indexOf(current);
  return (
    <ol className="steps">
      {STEPS.map((s, j) => <li key={s} className={j < i ? "done" : j === i ? "on" : ""} aria-current={j === i ? "step" : undefined}>{s}</li>)}
    </ol>
  );
}
