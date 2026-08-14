"use client";

import { useEffect, useState, useTransition } from "react";
import { applyToJobById } from "@/lib/actions/applications";
import SwipeCard from "./SwipeCard";
import type { JobAlert, RecruiterProfile } from "@/generated/prisma/client";

type JobWithRecruiter = JobAlert & { recruiterProfile: RecruiterProfile };

export default function SwipeDeck() {
  const [queue, setQueue] = useState<JobWithRecruiter[] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/discover/queue")
      .then((res) => res.json())
      .then((data) => setQueue(data.jobAlerts ?? []));
  }, []);

  function handleSwipe(applied: boolean) {
    if (!queue || queue.length === 0) return;
    const current = queue[0];
    setQueue(queue.slice(1));
    startTransition(async () => {
      await applyToJobById(current.id, applied);
    });
  }

  if (queue === null) {
    return <p className="text-sm text-zinc-500">Loading job alerts...</p>;
  }

  if (queue.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        You&apos;re all caught up — no new job alerts right now.
      </p>
    );
  }

  const current = queue[0];

  return (
    <div className="flex flex-col items-center gap-6">
      <SwipeCard job={current} />
      <div className="flex gap-4">
        <button
          onClick={() => handleSwipe(false)}
          disabled={isPending}
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
        >
          Pass
        </button>
        <button
          onClick={() => handleSwipe(true)}
          disabled={isPending}
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          Apply
        </button>
      </div>
      <p className="text-xs text-zinc-400">{queue.length - 1} more in queue</p>
    </div>
  );
}
