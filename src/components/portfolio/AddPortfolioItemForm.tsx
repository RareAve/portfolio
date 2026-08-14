"use client";

import { useActionState, useEffect, useRef } from "react";
import { addPortfolioItem } from "@/lib/actions/portfolio";

export default function AddPortfolioItemForm() {
  const [state, formAction, pending] = useActionState(addPortfolioItem, undefined);
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
      <h3 className="text-sm font-medium text-zinc-700">Add a project</h3>
      <input
        name="title"
        placeholder="Project title"
        required
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />
      <textarea
        name="description"
        placeholder="What did you build, and what was your role?"
        required
        rows={3}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          name="imageUrl"
          placeholder="Image URL (optional)"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
        <input
          name="link"
          placeholder="Project link (optional)"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>
      <input
        name="tags"
        placeholder="Tags, comma-separated (optional)"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
      >
        {pending ? "Adding..." : "Add project"}
      </button>
    </form>
  );
}
