import { updateStatus } from "@/app/admin/(panel)/actions";

/** Inline status changer — posts the unified server action (no client JS). */
export default function StatusForm({
  model,
  id,
  current,
  statuses,
}: {
  model: string;
  id: string;
  current: string;
  statuses: readonly string[];
}) {
  return (
    <form action={updateStatus} className="flex items-center gap-2">
      <input type="hidden" name="model" value={model} />
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`status-${id}`}>
        Update status
      </label>
      <select
        id={`status-${id}`}
        name="status"
        defaultValue={current}
        className="rounded-lg border border-line bg-char px-2.5 py-1.5 text-sm text-cream capitalize [color-scheme:dark] focus:border-gold focus:outline-none"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-sand transition-colors hover:border-gold hover:text-gold"
      >
        Save
      </button>
    </form>
  );
}
