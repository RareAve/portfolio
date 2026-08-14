import { db } from "@/lib/db";

function baseSlug(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "candidate"
  );
}

export async function generateUniqueSlug(name: string) {
  const base = baseSlug(name);
  let slug = base;
  let suffix = 0;

  while (await db.candidateProfile.findUnique({ where: { publicSlug: slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  return slug;
}
