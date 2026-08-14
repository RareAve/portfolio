import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user?.role === "CANDIDATE") {
    redirect("/portfolio/edit");
  }
  if (session?.user?.role === "RECRUITER") {
    redirect("/discover");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 text-center">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
        Get discovered for your work, not your resume.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-600">
        Build a portfolio, get discovered by recruiters, and match with the
        ones who are actually interested in what you&apos;ve built.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/signup"
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
