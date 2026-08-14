"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  senderUserId: string;
  body: string;
  createdAt: string;
};

export default function ChatThread({
  matchId,
  currentUserId,
}: {
  matchId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastCreatedAt = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const url = new URL(`/api/matches/${matchId}/messages`, window.location.origin);
      if (lastCreatedAt.current) {
        url.searchParams.set("after", lastCreatedAt.current);
      }
      const res = await fetch(url.toString());
      if (!res.ok || cancelled) return;
      const data = await res.json();
      if (!data.messages?.length) return;
      setMessages((prev) => [...prev, ...data.messages]);
      lastCreatedAt.current = data.messages[data.messages.length - 1].createdAt;
    }

    poll();
    const interval = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");

    const res = await fetch(`/api/matches/${matchId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      lastCreatedAt.current = data.message.createdAt;
    }
    setSending(false);
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-zinc-200">
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-400">Say hello — this is the start of your conversation.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
              m.senderUserId === currentUserId
                ? "self-end bg-zinc-900 text-white"
                : "self-start bg-zinc-100 text-zinc-900"
            }`}
          >
            {m.body}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2 border-t border-zinc-200 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}
