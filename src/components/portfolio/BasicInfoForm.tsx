"use client";

import { useActionState } from "react";
import { updateBasicInfo } from "@/lib/actions/profile";

type Props = {
  profile: { name: string; title: string; location: string };
};

export default function BasicInfoForm({ profile }: Props) {
  const [state, formAction, pending] = useActionState(updateBasicInfo, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            defaultValue={profile.name}
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium text-zinc-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={profile.title}
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="text-sm font-medium text-zinc-700">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={profile.location}
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

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
