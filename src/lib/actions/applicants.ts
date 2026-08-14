"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireRecruiterProfile() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") return null;
  return db.recruiterProfile.findUnique({ where: { userId: session.user.id } });
}

async function respondToApplication(applicationId: string, accept: boolean) {
  const recruiter = await requireRecruiterProfile();
  if (!recruiter) return;

  const application = await db.application.findUnique({
    where: { id: applicationId },
    include: { jobAlert: true },
  });
  if (
    !application ||
    application.jobAlert.recruiterProfileId !== recruiter.id ||
    !application.applied
  ) {
    return;
  }
  if (application.recruiterResponse !== "PENDING") return;

  if (accept) {
    await db.$transaction([
      db.application.update({
        where: { id: applicationId },
        data: { recruiterResponse: "ACCEPTED", respondedAt: new Date() },
      }),
      db.match.create({
        data: {
          applicationId,
          candidateProfileId: application.candidateProfileId,
          recruiterProfileId: application.jobAlert.recruiterProfileId,
          jobAlertId: application.jobAlertId,
        },
      }),
    ]);
  } else {
    await db.application.update({
      where: { id: applicationId },
      data: { recruiterResponse: "REJECTED", respondedAt: new Date() },
    });
  }

  revalidatePath(`/jobs/${application.jobAlertId}/applicants`);
  revalidatePath("/matches");
}

export async function acceptApplicant(formData: FormData): Promise<void> {
  const applicationId = formData.get("applicationId");
  if (typeof applicationId !== "string") return;
  await respondToApplication(applicationId, true);
}

export async function rejectApplicant(formData: FormData): Promise<void> {
  const applicationId = formData.get("applicationId");
  if (typeof applicationId !== "string") return;
  await respondToApplication(applicationId, false);
}
