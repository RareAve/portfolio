"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobAlertSchema } from "@/lib/validation";

export type ActionState = { error?: string } | undefined;

async function requireRecruiterProfile() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    return null;
  }
  return db.recruiterProfile.findUnique({ where: { userId: session.user.id } });
}

export async function addJobAlert(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireRecruiterProfile();
  if (!profile) return { error: "Not authorized" };

  const parsed = jobAlertSchema.safeParse({
    title: formData.get("title"),
    location: formData.get("location"),
    employmentType: formData.get("employmentType"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const count = await db.jobAlert.count({
    where: { recruiterProfileId: profile.id },
  });

  await db.jobAlert.create({
    data: {
      recruiterProfileId: profile.id,
      title: parsed.data.title,
      location: parsed.data.location,
      employmentType: parsed.data.employmentType,
      description: parsed.data.description,
      position: count,
    },
  });

  revalidatePath("/jobs");
  return undefined;
}

export async function updateJobAlert(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireRecruiterProfile();
  if (!profile) return { error: "Not authorized" };

  const alertId = formData.get("alertId");
  if (typeof alertId !== "string") return { error: "Missing job alert" };

  const alert = await db.jobAlert.findUnique({ where: { id: alertId } });
  if (!alert || alert.recruiterProfileId !== profile.id) {
    return { error: "Not authorized" };
  }

  const parsed = jobAlertSchema.safeParse({
    title: formData.get("title"),
    location: formData.get("location"),
    employmentType: formData.get("employmentType"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.jobAlert.update({
    where: { id: alertId },
    data: {
      title: parsed.data.title,
      location: parsed.data.location,
      employmentType: parsed.data.employmentType,
      description: parsed.data.description,
    },
  });

  revalidatePath("/jobs");
  return undefined;
}

export async function deleteJobAlert(formData: FormData): Promise<void> {
  const profile = await requireRecruiterProfile();
  if (!profile) return;

  const alertId = formData.get("alertId");
  if (typeof alertId !== "string") return;

  const alert = await db.jobAlert.findUnique({ where: { id: alertId } });
  if (!alert || alert.recruiterProfileId !== profile.id) return;

  await db.jobAlert.delete({ where: { id: alertId } });
  revalidatePath("/jobs");
}
