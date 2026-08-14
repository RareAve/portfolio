import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { acceptApplicant, rejectApplicant } from "@/lib/actions/applicants";

export default async function JobApplicantsPage({
  params,
}: {
  params: Promise<{ jobAlertId: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const recruiterProfile = await db.recruiterProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!recruiterProfile) {
    redirect("/onboarding/recruiter");
  }

  const { jobAlertId } = await params;

  const job = await db.jobAlert.findUnique({ where: { id: jobAlertId } });
  if (!job || job.recruiterProfileId !== recruiterProfile.id) {
    notFound();
  }

  const applicants = await db.application.findMany({
    where: { jobAlertId: job.id, applied: true, recruiterResponse: "PENDING" },
    include: { candidateProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <Link href="/jobs" className="text-sm text-zinc-500 underline hover:text-zinc-900">
        ← All job alerts
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        Applicants for {job.title}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">{job.location}</p>

      {applicants.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">No applicants yet.</p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {applicants.map((application) => {
          const candidate = application.candidateProfile;
          const skills = candidate.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

          return (
            <div key={application.id} className="rounded-xl border border-zinc-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-zinc-900">{candidate.name}</h3>
                  <p className="text-sm text-zinc-600">
                    {candidate.title} · {candidate.location}
                  </p>
                </div>
                <Link
                  href={`/p/${candidate.publicSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-zinc-500 underline hover:text-zinc-900"
                >
                  View portfolio
                </Link>
              </div>

              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {skills.slice(0, 6).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-3 text-sm text-zinc-700">{candidate.summary}</p>

              <div className="mt-4 flex gap-2">
                <form action={acceptApplicant}>
                  <input type="hidden" name="applicationId" value={application.id} />
                  <button
                    type="submit"
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                  >
                    Accept — complete match
                  </button>
                </form>
                <form action={rejectApplicant}>
                  <input type="hidden" name="applicationId" value={application.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
