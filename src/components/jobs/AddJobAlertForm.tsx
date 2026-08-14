"use client";

import { useActionState, useEffect, useRef } from "react";
import { addJobAlert } from "@/lib/actions/jobAlerts";
import { EMPLOYMENT_TYPES, EMPLOYMENT_TYPE_LABELS } from "@/lib/validation";

export default function AddJobAlertForm() {
  const [state, formAction, pending] = useActionState(addJobAlert, undefined);
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
      <h3 className="text-sm font-medium text-zinc-700">Post a job alert</h3>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="title"
          placeholder="Job title"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
        <input
          name="location"
          placeholder="Location"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <select
        name="employmentType"
        required
        defaultValue=""
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      >
        <option value="" disabled>
          Employment type
        </option>
        {EMPLOYMENT_TYPES.map((type) => (
          <option key={type} value={type}>
            {EMPLOYMENT_TYPE_LABELS[type]}
          </option>
        ))}
      </select>

      <textarea
        name="description"
        placeholder="Role description"
        required
        rows={3}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
      >
        {pending ? "Posting..." : "Post job alert"}
      </button>
    </form>
  );
}
