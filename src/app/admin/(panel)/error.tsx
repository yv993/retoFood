"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl border border-ember/40 bg-ember/10 p-8 text-center">
      <h2 className="font-display text-xl text-cream">Something went wrong</h2>
      <p className="mt-2 text-sm text-sand">Couldn&rsquo;t load this data. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="btn-gold mt-5 inline-flex cursor-pointer items-center rounded-full px-6 py-3 text-sm font-bold"
      >
        Retry
      </button>
    </div>
  );
}
