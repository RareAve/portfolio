"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { updatePortfolioItem, deletePortfolioItem } from "@/lib/actions/portfolio";
import type { PortfolioItem } from "@/generated/prisma/client";

export default function PortfolioItemCard({ item }: { item: PortfolioItem }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updatePortfolioItem, undefined);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      setEditing(false);
    }
    wasPending.current = pending;
  }, [pending, state]);

  const tags = item.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (editing) {
    return (
      <form
        action={formAction}
        className="flex flex-col gap-3 rounded-xl border border-zinc-300 p-4"
      >
        <input type="hidden" name="itemId" value={item.id} />
        <input
          name="title"
          defaultValue={item.title}
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
        <textarea
          name="description"
          defaultValue={item.description}
          required
          rows={3}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            name="imageUrl"
            defaultValue={item.imageUrl ?? ""}
            placeholder="Image URL"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
          <input
            name="link"
            defaultValue={item.link ?? ""}
            placeholder="Project link"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>
        <input
          name="tags"
          defaultValue={item.tags}
          placeholder="Tags, comma-separated"
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
          <h3 className="font-medium text-zinc-900">{item.title}</h3>
          <p className="mt-1 text-sm whitespace-pre-wrap text-zinc-600">
            {item.description}
          </p>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-zinc-900 underline"
            >
              View project
            </a>
          )}
        </div>
        <div className="flex shrink-0 gap-3 text-sm">
          <button
            onClick={() => setEditing(true)}
            className="text-zinc-600 hover:text-zinc-900"
          >
            Edit
          </button>
          <form action={deletePortfolioItem}>
            <input type="hidden" name="itemId" value={item.id} />
            <button type="submit" className="text-red-600 hover:text-red-800">
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
