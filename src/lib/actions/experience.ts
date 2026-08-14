"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EXPERIENCE_KINDS, experienceEntrySchema, type ExperienceKind } from "@/lib/validation";

export type ActionState = { error?: string } | undefined;

async function requireCandidateProfile() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    return null;
  }
  return db.candidateProfile.findUnique({ where: { userId: session.user.id } });
}

function parseKind(value: FormDataEntryValue | null): ExperienceKind | null {
  return typeof value === "string" && (EXPERIENCE_KINDS as readonly string[]).includes(value)
    ? (value as ExperienceKind)
    : null;
}

export async function addExperienceEntry(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireCandidateProfile();
  if (!profile) return { error: "Not authorized" };

  const kind = parseKind(formData.get("kind"));
  if (!kind) return { error: "Invalid section" };

  const parsed = experienceEntrySchema.safeParse({
    organization: formData.get("organization"),
    role: formData.get("role"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || "",
    description: formData.get("description") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const count = await db.experienceEntry.count({
    where: { candidateProfileId: profile.id, kind },
  });

  await db.experienceEntry.create({
    data: {
      candidateProfileId: profile.id,
      kind,
      organization: parsed.data.organization,
      role: parsed.data.role,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate || null,
      description: parsed.data.description || null,
      position: count,
    },
  });

  revalidatePath("/portfolio/edit");
  return undefined;
}

export async function updateExperienceEntry(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireCandidateProfile();
  if (!profile) return { error: "Not authorized" };

  const entryId = formData.get("entryId");
  if (typeof entryId !== "string") return { error: "Missing entry" };

  const entry = await db.experienceEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.candidateProfileId !== profile.id) {
    return { error: "Not authorized" };
  }

  const parsed = experienceEntrySchema.safeParse({
    organization: formData.get("organization"),
    role: formData.get("role"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || "",
    description: formData.get("description") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.experienceEntry.update({
    where: { id: entryId },
    data: {
      organization: parsed.data.organization,
      role: parsed.data.role,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate || null,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/portfolio/edit");
  return undefined;
}

export async function deleteExperienceEntry(formData: FormData): Promise<void> {
  const profile = await requireCandidateProfile();
  if (!profile) return;

  const entryId = formData.get("entryId");
  if (typeof entryId !== "string") return;

  const entry = await db.experienceEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.candidateProfileId !== profile.id) return;

  await db.experienceEntry.delete({ where: { id: entryId } });
  revalidatePath("/portfolio/edit");
}
