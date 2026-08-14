"use client";

import { useActionState } from "react";
import { createCandidateProfile } from "@/lib/actions/profile";

export default function CandidateOnboardingForm() {
  const [state, formAction, pending] = useActionState(createCandidateProfile, undefined);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700">
          Full name
        </label>
        <input
          id="name"
          name="name"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700">
          Title (e.g. "Frontend Engineer")
        </label>
        <input
          id="title"
          name="title"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="text-sm font-medium text-zinc-700">
          Location
        </label>
        <input
          id="location"
          name="location"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="skills" className="text-sm font-medium text-zinc-700">
          Skills (comma-separated)
        </label>
        <input
          id="skills"
          name="skills"
          required
          placeholder="React, TypeScript, Node.js"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="summary" className="text-sm font-medium text-zinc-700">
          Summary statement
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={4}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Continue to my portfolio"}
      </button>
    </form>
  );
}
