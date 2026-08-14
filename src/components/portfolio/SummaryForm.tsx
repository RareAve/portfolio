"use client";

import { useActionState } from "react";
import { updateSummary } from "@/lib/actions/profile";

export default function SummaryForm({ summary }: { summary: string }) {
  const [state, formAction, pending] = useActionState(updateSummary, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <textarea
        name="summary"
        defaultValue={summary}
        required
        rows={5}
        placeholder="A brief statement introducing who you are and what you're looking for."
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
