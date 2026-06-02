/** Animate a clone of an image flying into the navbar cart icon (id="cart-target"). */
export function flyToCart(sourceImg: HTMLElement | null | undefined) {
  if (typeof window === "undefined" || !sourceImg) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const target = document.getElementById("cart-target");
  if (!target) return;

  const s = sourceImg.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  if (s.width === 0) return;

  const clone = sourceImg.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: "fixed",
    left: `${s.left}px`,
    top: `${s.top}px`,
    width: `${s.width}px`,
    height: `${s.height}px`,
    borderRadius: "14px",
    objectFit: "cover",
    zIndex: "130",
    pointerEvents: "none",
    margin: "0",
    boxShadow: "0 20px 40px -12px rgba(0,0,0,.6)",
  });
  document.body.appendChild(clone);

  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);

  const anim = clone.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 50}px) scale(0.55)`,
        opacity: 0.95,
        offset: 0.6,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0.2 },
    ],
    { duration: 720, easing: "cubic-bezier(.4,.2,.2,1)" },
  );
  const cleanup = () => clone.remove();
  anim.finished.then(cleanup).catch(cleanup);
}
