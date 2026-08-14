"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { portfolioItemSchema } from "@/lib/validation";

export type ActionState = { error?: string } | undefined;

async function requireCandidateProfile() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    return null;
  }
  return db.candidateProfile.findUnique({ where: { userId: session.user.id } });
}

export async function addPortfolioItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireCandidateProfile();
  if (!profile) return { error: "Not authorized" };

  const parsed = portfolioItemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl") || "",
    link: formData.get("link") || "",
    tags: formData.get("tags") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const count = await db.portfolioItem.count({
    where: { candidateProfileId: profile.id },
  });

  await db.portfolioItem.create({
    data: {
      candidateProfileId: profile.id,
      title: parsed.data.title,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl || null,
      link: parsed.data.link || null,
      tags: parsed.data.tags,
      position: count,
    },
  });

  revalidatePath("/portfolio/edit");
  return undefined;
}

export async function updatePortfolioItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireCandidateProfile();
  if (!profile) return { error: "Not authorized" };

  const itemId = formData.get("itemId");
  if (typeof itemId !== "string") return { error: "Missing item" };

  const item = await db.portfolioItem.findUnique({ where: { id: itemId } });
  if (!item || item.candidateProfileId !== profile.id) {
    return { error: "Not authorized" };
  }

  const parsed = portfolioItemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl") || "",
    link: formData.get("link") || "",
    tags: formData.get("tags") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.portfolioItem.update({
    where: { id: itemId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl || null,
      link: parsed.data.link || null,
      tags: parsed.data.tags,
    },
  });

  revalidatePath("/portfolio/edit");
  return undefined;
}

export async function deletePortfolioItem(formData: FormData): Promise<void> {
  const profile = await requireCandidateProfile();
  if (!profile) return;

  const itemId = formData.get("itemId");
  if (typeof itemId !== "string") return;

  const item = await db.portfolioItem.findUnique({ where: { id: itemId } });
  if (!item || item.candidateProfileId !== profile.id) return;

  await db.portfolioItem.delete({ where: { id: itemId } });
  revalidatePath("/portfolio/edit");
}
