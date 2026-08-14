import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import BasicInfoForm from "@/components/portfolio/BasicInfoForm";
import SummaryForm from "@/components/portfolio/SummaryForm";
import SkillsForm from "@/components/portfolio/SkillsForm";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import PortfolioItemCard from "@/components/portfolio/PortfolioItemCard";
import AddPortfolioItemForm from "@/components/portfolio/AddPortfolioItemForm";
import { EXPERIENCE_KINDS, EXPERIENCE_SECTION_CONFIG } from "@/lib/validation";

export default async function PortfolioEditPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  const profile = await db.candidateProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      items: { orderBy: { position: "asc" } },
      experienceEntries: { orderBy: { position: "asc" } },
    },
  });

  if (!profile) {
    redirect("/onboarding/candidate");
  }

  const entriesByKind = Object.fromEntries(
    EXPERIENCE_KINDS.map((kind) => [
      kind,
      profile.experienceEntries.filter((entry) => entry.kind === kind),
    ]),
  );

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Your portfolio</h1>
        <a
          href={`/p/${profile.publicSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm text-zinc-500 underline hover:text-zinc-900"
        >
          View public page →
        </a>
      </div>

      <section className="mt-6 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Basic info</h2>
        <div className="rounded-xl border border-zinc-200 p-5">
          <BasicInfoForm profile={profile} />
        </div>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Summary statement</h2>
        <div className="rounded-xl border border-zinc-200 p-5">
          <SummaryForm summary={profile.summary} />
        </div>
      </section>

      {EXPERIENCE_KINDS.map((kind) => {
        const config = EXPERIENCE_SECTION_CONFIG[kind];
        return (
          <ExperienceSection
            key={kind}
            kind={kind}
            title={config.title}
            organizationLabel={config.organizationLabel}
            roleLabel={config.roleLabel}
            emptyHint={config.emptyHint}
            entries={entriesByKind[kind]}
          />
        );
      })}

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Skills</h2>
        <div className="rounded-xl border border-zinc-200 p-5">
          <SkillsForm skills={profile.skills} />
        </div>
      </section>

      <section className="mt-10 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Projects</h2>

        {profile.items.length === 0 && (
          <p className="text-sm text-zinc-500">
            No projects yet — add your first one below.
          </p>
        )}

        {profile.items.map((item) => (
          <PortfolioItemCard key={item.id} item={item} />
        ))}

        <AddPortfolioItemForm />
      </section>
    </div>
  );
}
