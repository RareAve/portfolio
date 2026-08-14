"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { updateExperienceEntry, deleteExperienceEntry } from "@/lib/actions/experience";
import type { ExperienceEntry } from "@/generated/prisma/client";

type Props = {
  entry: ExperienceEntry;
  organizationLabel: string;
  roleLabel: string;
};

export default function ExperienceEntryCard({ entry, organizationLabel, roleLabel }: Props) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateExperienceEntry, undefined);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      setEditing(false);
    }
    wasPending.current = pending;
  }, [pending, state]);

  if (editing) {
    return (
      <form
        action={formAction}
        className="flex flex-col gap-3 rounded-xl border border-zinc-300 p-4"
      >
        <input type="hidden" name="entryId" value={entry.id} />

        <div className="grid grid-cols-2 gap-3">
          <input
            name="organization"
            defaultValue={entry.organization}
            placeholder={organizationLabel}
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
          <input
            name="role"
            defaultValue={entry.role}
            placeholder={roleLabel}
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            name="startDate"
            defaultValue={entry.startDate}
            placeholder="Start date"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
          <input
            name="endDate"
            defaultValue={entry.endDate ?? ""}
            placeholder="End date (blank = present)"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>

        <textarea
          name="description"
          defaultValue={entry.description ?? ""}
          placeholder="Description (optional)"
          rows={3}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
          >
            {pending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-medium text-zinc-900">{entry.organization}</h3>
          <p className="text-sm text-zinc-600">{entry.role}</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {entry.startDate} – {entry.endDate || "Present"}
          </p>
          {entry.description && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
              {entry.description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-3 text-sm">
          <button
            onClick={() => setEditing(true)}
            className="text-zinc-600 hover:text-zinc-900"
          >
            Edit
          </button>
          <form action={deleteExperienceEntry}>
            <input type="hidden" name="entryId" value={entry.id} />
            <button type="submit" className="text-red-600 hover:text-red-800">
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
