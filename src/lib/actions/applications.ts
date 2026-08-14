"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireCandidateProfile() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") return null;
  return db.candidateProfile.findUnique({ where: { userId: session.user.id } });
}

async function upsertApplication(jobAlertId: string, applied: boolean) {
  const candidate = await requireCandidateProfile();
  if (!candidate) return;

  await db.application.upsert({
    where: {
      candidateProfileId_jobAlertId: {
        candidateProfileId: candidate.id,
        jobAlertId,
      },
    },
    update: { applied },
    create: {
      candidateProfileId: candidate.id,
      jobAlertId,
      applied,
    },
  });

  revalidatePath("/browse");
  revalidatePath("/discover");
}

export async function applyToJob(formData: FormData): Promise<void> {
  const jobAlertId = formData.get("jobAlertId");
  if (typeof jobAlertId !== "string") return;
  await upsertApplication(jobAlertId, true);
}

export async function passJob(formData: FormData): Promise<void> {
  const jobAlertId = formData.get("jobAlertId");
  if (typeof jobAlertId !== "string") return;
  await upsertApplication(jobAlertId, false);
}

export async function applyToJobById(jobAlertId: string, applied: boolean) {
  await upsertApplication(jobAlertId, applied);
}
