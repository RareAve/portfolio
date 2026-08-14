"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/lib/actions/account";
import PasswordInput from "@/components/ui/PasswordInput";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, undefined);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Create your account</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline">
            Log in
          </Link>
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <fieldset className="flex gap-3">
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 px-3 py-3 has-checked:border-zinc-900 has-checked:bg-zinc-900 has-checked:text-white">
              <input
                type="radio"
                name="role"
                value="CANDIDATE"
                defaultChecked
                className="sr-only"
              />
              <span className="text-sm font-medium">I&apos;m a candidate</span>
            </label>
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 px-3 py-3 has-checked:border-zinc-900 has-checked:bg-zinc-900 has-checked:text-white">
              <input type="radio" name="role" value="RECRUITER" className="sr-only" />
              <span className="text-sm font-medium">I&apos;m a recruiter</span>
            </label>
          </fieldset>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-zinc-700">
              Password
            </label>
            <PasswordInput id="password" name="password" required minLength={8} />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
          >
            {pending ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
