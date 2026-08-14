import { EMPLOYMENT_TYPES, EMPLOYMENT_TYPE_LABELS } from "@/lib/validation";

type Props = {
  defaultValues: { q?: string; location?: string; employmentType?: string };
};

export default function FilterBar({ defaultValues }: Props) {
  return (
    <form method="get" className="mt-6 flex flex-wrap gap-3">
      <input
        name="q"
        defaultValue={defaultValues.q}
        placeholder="Search job title"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />
      <input
        name="location"
        defaultValue={defaultValues.location}
        placeholder="Location"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />
      <select
        name="employmentType"
        defaultValue={defaultValues.employmentType ?? ""}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      >
        <option value="">Any employment type</option>
        {EMPLOYMENT_TYPES.map((type) => (
          <option key={type} value={type}>
            {EMPLOYMENT_TYPE_LABELS[type]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Filter
      </button>
    </form>
  );
}
