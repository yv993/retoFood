/** Tiny dependency-free confetti burst using the Web Animations API. */
export function fireConfetti(count = 36) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#C9A227", "#E3C766", "#B5481F", "#F5EFE6"];
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:120;overflow:hidden";
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    const size = 6 + Math.random() * 6;
    piece.style.cssText = `position:absolute;left:${
      50 + (Math.random() * 44 - 22)
    }%;top:42%;width:${size}px;height:${size * 0.6}px;background:${
      colors[i % colors.length]
    };border-radius:2px`;
    const dx = (Math.random() * 2 - 1) * 240;
    const dy = -(140 + Math.random() * 220);
    const rot = Math.random() * 720;
    piece.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
          opacity: 1,
          offset: 0.6,
        },
        {
          transform: `translate(${dx * 1.2}px, ${dy + 460}px) rotate(${rot * 1.5}deg)`,
          opacity: 0,
        },
      ],
      { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(.2,.6,.3,1)" },
    );
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 1800);
}
