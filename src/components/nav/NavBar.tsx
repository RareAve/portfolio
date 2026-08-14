import Link from "next/link";
import { auth } from "@/lib/auth";
import { logout } from "@/lib/actions/account";

export default async function NavBar() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <header className="border-b border-zinc-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          Foli
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium text-zinc-600">
          {role === "CANDIDATE" && (
            <>
              <Link href="/discover" className="hover:text-zinc-900">
                Discover
              </Link>
              <Link href="/browse" className="hover:text-zinc-900">
                Browse
              </Link>
              <Link href="/portfolio/edit" className="hover:text-zinc-900">
                My portfolio
              </Link>
              <Link href="/matches" className="hover:text-zinc-900">
                Matches
              </Link>
            </>
          )}

          {role === "RECRUITER" && (
            <>
              <Link href="/jobs" className="hover:text-zinc-900">
                Job alerts
              </Link>
              <Link href="/matches" className="hover:text-zinc-900">
                Matches
              </Link>
            </>
          )}

          {session?.user ? (
            <form action={logout}>
              <button type="submit" className="hover:text-zinc-900">
                Log out
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="hover:text-zinc-900">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-4 py-1.5 text-white hover:bg-zinc-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
