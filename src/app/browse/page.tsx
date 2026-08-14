import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import FilterBar from "@/components/browse/FilterBar";
import JobGridCard from "@/components/browse/JobGridCard";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; location?: string; employmentType?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  const candidateProfile = await db.candidateProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!candidateProfile) {
    redirect("/onboarding/candidate");
  }

  const { q, location, employmentType } = await searchParams;

  const jobAlerts = await db.jobAlert.findMany({
    where: {
      ...(employmentType ? { employmentType } : {}),
      ...(location ? { location: { contains: location } } : {}),
      ...(q ? { title: { contains: q } } : {}),
    },
    include: {
      recruiterProfile: true,
      applications: { where: { candidateProfileId: candidateProfile.id } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900">Browse jobs</h1>
      <FilterBar defaultValues={{ q, location, employmentType }} />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {jobAlerts.map((job) => (
          <JobGridCard
            key={job.id}
            job={job}
            existingApplication={job.applications[0]}
          />
        ))}
        {jobAlerts.length === 0 && (
          <p className="text-sm text-zinc-500">No jobs match your filters.</p>
        )}
      </div>
    </div>
  );
}
