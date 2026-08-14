"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  basicInfoSchema,
  candidateProfileSchema,
  recruiterProfileSchema,
  skillsSchema,
  summarySchema,
} from "@/lib/validation";
import { generateUniqueSlug } from "@/lib/slug";

export type ActionState = { error?: string } | undefined;

export async function createCandidateProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  const parsed = candidateProfileSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    location: formData.get("location"),
    skills: formData.get("skills"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await db.candidateProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    redirect("/portfolio/edit");
  }

  const publicSlug = await generateUniqueSlug(parsed.data.name);

  await db.candidateProfile.create({
    data: { userId: session.user.id, publicSlug, ...parsed.data },
  });

  redirect("/portfolio/edit");
}

export async function updateBasicInfo(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  const parsed = basicInfoSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title"),
    location: formData.get("location"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.candidateProfile.update({
    where: { userId: session.user.id },
    data: parsed.data,
  });

  revalidatePath("/portfolio/edit");
  return undefined;
}

export async function updateSummary(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  const parsed = summarySchema.safeParse({
    summary: formData.get("summary"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.candidateProfile.update({
    where: { userId: session.user.id },
    data: parsed.data,
  });

  revalidatePath("/portfolio/edit");
  return undefined;
}

export async function updateSkills(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  const parsed = skillsSchema.safeParse({
    skills: formData.get("skills"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.candidateProfile.update({
    where: { userId: session.user.id },
    data: parsed.data,
  });

  revalidatePath("/portfolio/edit");
  return undefined;
}

export async function createRecruiterProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const parsed = recruiterProfileSchema.safeParse({
    companyName: formData.get("companyName"),
    title: formData.get("title"),
    location: formData.get("location") || undefined,
    bio: formData.get("bio") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await db.recruiterProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    redirect("/discover");
  }

  await db.recruiterProfile.create({
    data: { userId: session.user.id, ...parsed.data },
  });

  redirect("/discover");
}
