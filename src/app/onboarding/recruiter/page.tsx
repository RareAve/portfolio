import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import RecruiterOnboardingForm from "@/components/portfolio/RecruiterOnboardingForm";

export default async function RecruiterOnboardingPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const existing = await db.recruiterProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    redirect("/discover");
  }

  return (
    <div className="flex flex-1 justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Tell us about your search
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Candidates will see this when they review your interest.
        </p>
        <RecruiterOnboardingForm />
      </div>
    </div>
  );
}
