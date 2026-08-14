import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function getAuthorizedMatch(matchId: string, userId: string) {
  const match = await db.match.findUnique({
    where: { id: matchId },
    include: { candidateProfile: true, recruiterProfile: true },
  });
  if (!match) return null;

  const isCandidate = match.candidateProfile.userId === userId;
  const isRecruiter = match.recruiterProfile.userId === userId;
  if (!isCandidate && !isRecruiter) return null;

  return match;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { matchId } = await params;
  const match = await getAuthorizedMatch(matchId, session.user.id);
  if (!match) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after");

  const messages = await db.message.findMany({
    where: {
      matchId,
      ...(after ? { createdAt: { gt: new Date(after) } } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { matchId } = await params;
  const match = await getAuthorizedMatch(matchId, session.user.id);
  if (!match) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
  }

  const message = await db.message.create({
    data: { matchId, senderUserId: session.user.id, body: text },
  });

  return NextResponse.json({ message });
}
