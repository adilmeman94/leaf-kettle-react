// Simple generated illustration, so the project needs no image files.
export default function ProductArt({ product, className = "" }) {
  return (
    <div className={"art " + className} style={{ background: product.color }} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <path d="M50 10 C80 24 86 62 50 90 C14 62 20 24 50 10Z" fill={product.accent} />
        <path d="M50 20 V82" stroke="rgba(0,0,0,.22)" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
}
