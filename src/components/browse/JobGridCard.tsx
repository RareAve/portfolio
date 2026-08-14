import { applyToJob, passJob } from "@/lib/actions/applications";
import { EMPLOYMENT_TYPE_LABELS, type EmploymentType } from "@/lib/validation";
import type { Application, JobAlert, RecruiterProfile } from "@/generated/prisma/client";

type Props = {
  job: JobAlert & { recruiterProfile: RecruiterProfile };
  existingApplication?: Application;
};

export default function JobGridCard({ job, existingApplication }: Props) {
  return (
    <div className="rounded-xl border border-zinc-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-zinc-900">{job.title}</h3>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
              {EMPLOYMENT_TYPE_LABELS[job.employmentType as EmploymentType]}
            </span>
          </div>
          <p className="text-sm text-zinc-600">
            {job.recruiterProfile.companyName} · {job.location}
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-zinc-600">{job.description}</p>

      <div className="mt-4 flex gap-2">
        {existingApplication ? (
          <span className="text-sm text-zinc-500">
            {existingApplication.applied ? "Applied" : "Passed"}
          </span>
        ) : (
          <>
            <form action={applyToJob}>
              <input type="hidden" name="jobAlertId" value={job.id} />
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Apply
              </button>
            </form>
            <form action={passJob}>
              <input type="hidden" name="jobAlertId" value={job.id} />
              <button
                type="submit"
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Pass
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
