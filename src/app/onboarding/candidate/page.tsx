import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import CandidateOnboardingForm from "@/components/portfolio/CandidateOnboardingForm";

export default async function CandidateOnboardingPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  const existing = await db.candidateProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    redirect("/portfolio/edit");
  }

  return (
    <div className="flex flex-1 justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Set up your portfolio
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          This is what recruiters will see. You can add specific projects next.
        </p>
        <CandidateOnboardingForm />
      </div>
    </div>
  );
}
