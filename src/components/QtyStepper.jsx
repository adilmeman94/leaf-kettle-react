export default function QtyStepper({ value, onDec, onInc, label = "Quantity" }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button type="button" onClick={onDec} aria-label="Decrease quantity">−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={onInc} aria-label="Increase quantity">+</button>
    </div>
  );
}
