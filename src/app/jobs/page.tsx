import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import JobAlertCard from "@/components/jobs/JobAlertCard";
import AddJobAlertForm from "@/components/jobs/AddJobAlertForm";

export default async function JobsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const profile = await db.recruiterProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      jobAlerts: {
        orderBy: { position: "asc" },
        include: {
          _count: {
            select: {
              applications: { where: { applied: true, recruiterResponse: "PENDING" } },
            },
          },
        },
      },
    },
  });

  if (!profile) {
    redirect("/onboarding/recruiter");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900">Job alerts</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Post the roles you&apos;re hiring for — candidates apply directly, and
        you&apos;ll see who&apos;s interested here.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {profile.jobAlerts.length === 0 && (
          <p className="text-sm text-zinc-500">
            No job alerts yet — post your first one below.
          </p>
        )}

        {profile.jobAlerts.map((alert) => (
          <JobAlertCard
            key={alert.id}
            alert={alert}
            applicantCount={alert._count.applications}
          />
        ))}

        <AddJobAlertForm />
      </div>
    </div>
  );
}
