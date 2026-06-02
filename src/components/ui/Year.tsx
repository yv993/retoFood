/** Current year for the footer. Rendered server-side; suppress hydration drift. */
export default function Year() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
