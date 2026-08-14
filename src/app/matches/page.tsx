import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type MatchDisplay = { id: string; name: string; subtitle: string; jobTitle: string };

export default async function MatchesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  let display: MatchDisplay[];

  if (session.user.role === "CANDIDATE") {
    const profile = await db.candidateProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) redirect("/onboarding/candidate");

    const rows = await db.match.findMany({
      where: { candidateProfileId: profile.id },
      include: { recruiterProfile: true, jobAlert: true },
      orderBy: { createdAt: "desc" },
    });
    display = rows.map((m) => ({
      id: m.id,
      name: m.recruiterProfile.companyName,
      subtitle: m.recruiterProfile.title,
      jobTitle: m.jobAlert.title,
    }));
  } else {
    const profile = await db.recruiterProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) redirect("/onboarding/recruiter");

    const rows = await db.match.findMany({
      where: { recruiterProfileId: profile.id },
      include: { candidateProfile: true, jobAlert: true },
      orderBy: { createdAt: "desc" },
    });
    display = rows.map((m) => ({
      id: m.id,
      name: m.candidateProfile.name,
      subtitle: m.candidateProfile.title,
      jobTitle: m.jobAlert.title,
    }));
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900">Matches</h1>

      {display.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">No matches yet.</p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {display.map((match) => (
          <Link
            key={match.id}
            href={`/matches/${match.id}`}
            className="rounded-xl border border-zinc-200 p-4 hover:border-zinc-400"
          >
            <p className="font-medium text-zinc-900">{match.name}</p>
            <p className="text-sm text-zinc-500">{match.subtitle}</p>
            <p className="mt-1 text-xs text-zinc-400">{match.jobTitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
