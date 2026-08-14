import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EXPERIENCE_KINDS, EXPERIENCE_SECTION_CONFIG } from "@/lib/validation";

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const profile = await db.candidateProfile.findUnique({
    where: { publicSlug: slug },
    include: {
      items: { orderBy: { position: "asc" } },
      experienceEntries: { orderBy: { position: "asc" } },
    },
  });

  if (!profile) {
    notFound();
  }

  const skills = profile.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-zinc-900">{profile.name}</h1>
      <p className="mt-1 text-lg text-zinc-600">{profile.title}</p>
      <p className="mt-1 text-sm text-zinc-500">{profile.location}</p>

      <p className="mt-6 whitespace-pre-wrap text-zinc-700">{profile.summary}</p>

      {EXPERIENCE_KINDS.map((kind) => {
        const config = EXPERIENCE_SECTION_CONFIG[kind];
        const entries = profile.experienceEntries.filter((e) => e.kind === kind);
        if (entries.length === 0) return null;

        return (
          <section key={kind} className="mt-10 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-zinc-900">{config.title}</h2>
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-zinc-200 p-5">
                <h3 className="font-medium text-zinc-900">{entry.organization}</h3>
                <p className="text-sm text-zinc-600">{entry.role}</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {entry.startDate} – {entry.endDate || "Present"}
                </p>
                {entry.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                    {entry.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        );
      })}

      {skills.length > 0 && (
        <section className="mt-10 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-900">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-zinc-900">Projects</h2>

        {profile.items.length === 0 && (
          <p className="text-sm text-zinc-500">No projects added yet.</p>
        )}

        {profile.items.map((item) => {
          const tags = item.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          return (
            <article key={item.id} className="rounded-xl border border-zinc-200 p-5">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="mb-4 max-h-72 w-full rounded-lg object-cover"
                />
              )}
              <h3 className="text-lg font-medium text-zinc-900">{item.title}</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-600">
                {item.description}
              </p>
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-zinc-900 underline"
                >
                  View project
                </a>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
