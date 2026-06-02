export default function Loading() {
  return (
    <div className="min-h-[100svh] bg-ink px-4 pt-32 sm:px-6 sm:pt-40">
      <div className="mx-auto max-w-content animate-pulse">
        <div className="mx-auto h-3 w-28 rounded-full bg-line" />
        <div className="mx-auto mt-5 h-12 w-2/3 rounded-2xl bg-char" />
        <div className="mx-auto mt-4 h-4 w-1/2 rounded-full bg-line" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-3xl border border-line bg-char">
              <div className="h-60 w-full bg-line/60" />
              <div className="space-y-3 p-6">
                <div className="h-5 w-1/2 rounded bg-line" />
                <div className="h-3 w-full rounded bg-line/70" />
                <div className="h-3 w-2/3 rounded bg-line/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
