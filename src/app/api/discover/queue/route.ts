import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidateProfile = await db.candidateProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!candidateProfile) {
    return NextResponse.json({ error: "No candidate profile" }, { status: 400 });
  }

  const jobAlerts = await db.jobAlert.findMany({
    where: {
      applications: { none: { candidateProfileId: candidateProfile.id } },
    },
    include: { recruiterProfile: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ jobAlerts });
}
