"use client";

import { useActionState } from "react";
import { createRecruiterProfile } from "@/lib/actions/profile";

export default function RecruiterOnboardingForm() {
  const [state, formAction, pending] = useActionState(createRecruiterProfile, undefined);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="companyName" className="text-sm font-medium text-zinc-700">
          Company name
        </label>
        <input
          id="companyName"
          name="companyName"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700">
          Your title
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="Technical Recruiter"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="text-sm font-medium text-zinc-700">
          Location (optional)
        </label>
        <input
          id="location"
          name="location"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="bio" className="text-sm font-medium text-zinc-700">
          About what you're hiring for (optional)
        </label>
        <textarea
          id="bio"
          name="bio"
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
        {pending ? "Saving..." : "Start discovering candidates"}
      </button>
    </form>
  );
}
