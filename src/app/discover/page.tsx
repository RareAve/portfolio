import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import SwipeDeck from "@/components/discover/SwipeDeck";

export default async function DiscoverPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  const candidateProfile = await db.candidateProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!candidateProfile) {
    redirect("/onboarding/candidate");
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900">Discover jobs</h1>
      <div className="mt-8 flex w-full justify-center">
        <SwipeDeck />
      </div>
    </div>
  );
}
