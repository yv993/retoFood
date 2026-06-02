/**
 * App Router template re-mounts on every navigation. A pure-CSS enter animation
 * (`.page-in`) gives a per-route transition with zero JS; reduced-motion no-ops
 * it via the global media query in globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
