import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import ChatThread from "@/components/chat/ChatThread";
import { EMPLOYMENT_TYPE_LABELS, type EmploymentType } from "@/lib/validation";

export default async function MatchChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { matchId } = await params;

  const match = await db.match.findUnique({
    where: { id: matchId },
    include: {
      candidateProfile: true,
      recruiterProfile: true,
      jobAlert: true,
    },
  });
  if (!match) {
    notFound();
  }

  const isCandidate = match.candidateProfile.userId === session.user.id;
  const isRecruiter = match.recruiterProfile.userId === session.user.id;
  if (!isCandidate && !isRecruiter) {
    notFound();
  }

  const otherPartyName = isCandidate
    ? match.recruiterProfile.companyName
    : match.candidateProfile.name;
  const otherPartySubtitle = isCandidate
    ? match.recruiterProfile.title
    : match.candidateProfile.title;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-xl font-semibold text-zinc-900">{otherPartyName}</h1>
      <p className="text-sm text-zinc-500">{otherPartySubtitle}</p>

      <div className="mt-4 rounded-xl border border-zinc-200 p-4">
        <p className="text-xs font-medium text-zinc-500">Matched for</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm font-medium text-zinc-900">{match.jobAlert.title}</p>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
            {EMPLOYMENT_TYPE_LABELS[match.jobAlert.employmentType as EmploymentType]}
          </span>
        </div>
        <p className="text-xs text-zinc-500">{match.jobAlert.location}</p>
        <p className="mt-2 text-sm text-zinc-600">{match.jobAlert.description}</p>
      </div>

      <div className="mt-6">
        <ChatThread matchId={match.id} currentUserId={session.user.id} />
      </div>
    </div>
  );
}
