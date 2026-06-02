export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-9 w-48 rounded-lg bg-char" />
      <div className="mb-6 h-11 w-full rounded-xl bg-char" />
      <div className="space-y-2 rounded-2xl border border-line p-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded-lg bg-char" />
        ))}
      </div>
    </div>
  );
}
