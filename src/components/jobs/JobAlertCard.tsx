"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { updateJobAlert, deleteJobAlert } from "@/lib/actions/jobAlerts";
import { EMPLOYMENT_TYPES, EMPLOYMENT_TYPE_LABELS, type EmploymentType } from "@/lib/validation";
import type { JobAlert } from "@/generated/prisma/client";

type Props = {
  alert: JobAlert;
  applicantCount: number;
};

export default function JobAlertCard({ alert, applicantCount }: Props) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateJobAlert, undefined);
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
        <input type="hidden" name="alertId" value={alert.id} />

        <div className="grid grid-cols-2 gap-3">
          <input
            name="title"
            defaultValue={alert.title}
            placeholder="Job title"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
          <input
            name="location"
            defaultValue={alert.location}
            placeholder="Location"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>

        <select
          name="employmentType"
          defaultValue={alert.employmentType}
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        >
          {EMPLOYMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {EMPLOYMENT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          defaultValue={alert.description}
          placeholder="Role description"
          required
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
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-zinc-900">{alert.title}</h3>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
              {EMPLOYMENT_TYPE_LABELS[alert.employmentType as EmploymentType]}
            </span>
          </div>
          <p className="text-sm text-zinc-600">{alert.location}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
            {alert.description}
          </p>
          <Link
            href={`/jobs/${alert.id}/applicants`}
            className="mt-2 inline-block text-sm text-zinc-900 underline hover:text-zinc-700"
          >
            View applicants ({applicantCount})
          </Link>
        </div>
        <div className="flex shrink-0 gap-3 text-sm">
          <button
            onClick={() => setEditing(true)}
            className="text-zinc-600 hover:text-zinc-900"
          >
            Edit
          </button>
          <form action={deleteJobAlert}>
            <input type="hidden" name="alertId" value={alert.id} />
            <button type="submit" className="text-red-600 hover:text-red-800">
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
