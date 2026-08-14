"use client";

import { useActionState, useEffect, useRef } from "react";
import { addExperienceEntry } from "@/lib/actions/experience";
import type { ExperienceKind } from "@/lib/validation";

type Props = {
  kind: ExperienceKind;
  organizationLabel: string;
  roleLabel: string;
};

export default function AddExperienceEntryForm({ kind, organizationLabel, roleLabel }: Props) {
  const [state, formAction, pending] = useActionState(addExperienceEntry, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-zinc-300 p-4"
    >
      <input type="hidden" name="kind" value={kind} />
      <h3 className="text-sm font-medium text-zinc-700">Add entry</h3>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="organization"
          placeholder={organizationLabel}
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
        <input
          name="role"
          placeholder={roleLabel}
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="startDate"
          placeholder="Start date (e.g. 2019)"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
        <input
          name="endDate"
          placeholder="End date (blank = present)"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <textarea
        name="description"
        placeholder="Description (optional)"
        rows={3}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
      >
        {pending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
