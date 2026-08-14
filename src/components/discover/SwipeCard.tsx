import { EMPLOYMENT_TYPE_LABELS, type EmploymentType } from "@/lib/validation";
import type { JobAlert, RecruiterProfile } from "@/generated/prisma/client";

type JobWithRecruiter = JobAlert & { recruiterProfile: RecruiterProfile };

export default function SwipeCard({ job }: { job: JobWithRecruiter }) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-zinc-900">{job.title}</h2>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
          {EMPLOYMENT_TYPE_LABELS[job.employmentType as EmploymentType]}
        </span>
      </div>
      <p className="text-sm text-zinc-600">
        {job.recruiterProfile.companyName} · {job.location}
      </p>

      <p className="mt-4 whitespace-pre-wrap text-sm text-zinc-700">{job.description}</p>

      {job.recruiterProfile.bio && (
        <p className="mt-4 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600">
          {job.recruiterProfile.bio}
        </p>
      )}
    </div>
  );
}
