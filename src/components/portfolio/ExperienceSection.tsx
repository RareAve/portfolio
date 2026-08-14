import ExperienceEntryCard from "./ExperienceEntryCard";
import AddExperienceEntryForm from "./AddExperienceEntryForm";
import type { ExperienceEntry } from "@/generated/prisma/client";
import type { ExperienceKind } from "@/lib/validation";

type Props = {
  kind: ExperienceKind;
  title: string;
  organizationLabel: string;
  roleLabel: string;
  emptyHint: string;
  entries: ExperienceEntry[];
};

export default function ExperienceSection({
  kind,
  title,
  organizationLabel,
  roleLabel,
  emptyHint,
  entries,
}: Props) {
  return (
    <section className="mt-10 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>

      {entries.length === 0 && <p className="text-sm text-zinc-500">{emptyHint}</p>}

      {entries.map((entry) => (
        <ExperienceEntryCard
          key={entry.id}
          entry={entry}
          organizationLabel={organizationLabel}
          roleLabel={roleLabel}
        />
      ))}

      <AddExperienceEntryForm
        kind={kind}
        organizationLabel={organizationLabel}
        roleLabel={roleLabel}
      />
    </section>
  );
}
