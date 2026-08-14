import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const PASSWORD = "password123";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function upsertUser(email: string, role: "CANDIDATE" | "RECRUITER") {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  return db.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, role },
  });
}

type ExperienceSeed = {
  kind: "EDUCATION" | "PROFESSIONAL" | "COMMUNITY";
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
};

async function main() {
  const recruiter = await upsertUser("recruiter1@test.com", "RECRUITER");
  const recruiterProfile = await db.recruiterProfile.upsert({
    where: { userId: recruiter.id },
    update: {},
    create: {
      userId: recruiter.id,
      companyName: "Northwind Labs",
      title: "Technical Recruiter",
      location: "Remote",
      bio: "Hiring across the product engineering org.",
    },
  });

  const existingJobAlerts = await db.jobAlert.count({
    where: { recruiterProfileId: recruiterProfile.id },
  });
  if (existingJobAlerts === 0) {
    await db.jobAlert.createMany({
      data: [
        {
          recruiterProfileId: recruiterProfile.id,
          title: "Senior Frontend Engineer",
          location: "Austin, TX (Hybrid)",
          employmentType: "FULL_TIME",
          description:
            "Own the core product surface, mentor junior engineers, and help shape our design system.",
          position: 0,
        },
        {
          recruiterProfileId: recruiterProfile.id,
          title: "Backend Contractor",
          location: "Remote",
          employmentType: "CONTRACT",
          description:
            "3-month contract to help migrate our order pipeline to an event-driven architecture.",
          position: 1,
        },
      ],
    });
  }

  const candidates = [
    {
      email: "candidate1@test.com",
      name: "Alex Rivera",
      title: "Frontend Engineer",
      location: "Austin, TX",
      skills: "React, TypeScript, Next.js",
      summary:
        "I build fast, accessible web apps and love turning rough ideas into polished products.",
      items: [
        {
          title: "Realtime Chat App",
          description:
            "Built a WebSocket-based chat app with React and Node, used by 500+ beta users.",
          tags: "React, WebSockets, Node.js",
        },
      ],
      experience: [
        {
          kind: "EDUCATION",
          organization: "University of Texas at Austin",
          role: "B.S. Computer Science",
          startDate: "2015",
          endDate: "2019",
        },
        {
          kind: "PROFESSIONAL",
          organization: "Brightloop",
          role: "Frontend Engineer",
          startDate: "2021",
          endDate: "",
          description: "Lead frontend engineer on the core product team.",
        },
      ] satisfies ExperienceSeed[],
    },
    {
      email: "candidate2@test.com",
      name: "Jamie Chen",
      title: "Backend Engineer",
      location: "Remote",
      skills: "Node.js, PostgreSQL, Go",
      summary: "I design scalable APIs and love working with distributed systems.",
      items: [
        {
          title: "Event-driven order pipeline",
          description:
            "Migrated a monolith checkout flow to an event-driven pipeline handling 10k orders/day.",
          tags: "Go, Kafka, PostgreSQL",
        },
      ],
      experience: [
        {
          kind: "EDUCATION",
          organization: "Georgia Tech",
          role: "M.S. Computer Science",
          startDate: "2017",
          endDate: "2019",
        },
        {
          kind: "PROFESSIONAL",
          organization: "Fernwave",
          role: "Backend Engineer",
          startDate: "2019",
          endDate: "",
          description: "Own the order and payments services.",
        },
      ] satisfies ExperienceSeed[],
    },
    {
      email: "candidate3@test.com",
      name: "Priya Nair",
      title: "Product Designer",
      location: "New York, NY",
      skills: "Figma, Design Systems, User Research",
      summary: "I turn fuzzy problems into clear, usable interfaces.",
      items: [
        {
          title: "Design system overhaul",
          description:
            "Led a token-based design system rollout across 6 product teams.",
          tags: "Figma, Design Systems",
        },
      ],
      experience: [
        {
          kind: "EDUCATION",
          organization: "Rhode Island School of Design",
          role: "B.F.A. Graphic Design",
          startDate: "2014",
          endDate: "2018",
        },
        {
          kind: "PROFESSIONAL",
          organization: "Solace Health",
          role: "Senior Product Designer",
          startDate: "2020",
          endDate: "",
          description: "Design lead for the patient-facing product.",
        },
      ] satisfies ExperienceSeed[],
    },
    {
      email: "candidate4@test.com",
      name: "Marcus Bell",
      title: "Data Engineer",
      location: "Chicago, IL",
      skills: "Python, Airflow, dbt",
      summary: "I build reliable data pipelines that teams actually trust.",
      items: [
        {
          title: "Analytics warehouse rebuild",
          description:
            "Rebuilt the analytics warehouse with dbt, cutting pipeline failures by 80%.",
          tags: "Python, dbt, Airflow",
        },
      ],
      experience: [
        {
          kind: "EDUCATION",
          organization: "University of Illinois",
          role: "B.S. Statistics",
          startDate: "2013",
          endDate: "2017",
        },
        {
          kind: "PROFESSIONAL",
          organization: "Harborlight Analytics",
          role: "Data Engineer",
          startDate: "2018",
          endDate: "",
          description: "Built and maintain the analytics data platform.",
        },
      ] satisfies ExperienceSeed[],
    },
  ];

  for (const c of candidates) {
    const user = await upsertUser(c.email, "CANDIDATE");

    const existing = await db.candidateProfile.findUnique({ where: { userId: user.id } });
    if (existing) continue;

    const profile = await db.candidateProfile.create({
      data: {
        userId: user.id,
        publicSlug: slugify(c.name),
        name: c.name,
        title: c.title,
        location: c.location,
        skills: c.skills,
        summary: c.summary,
      },
    });

    for (const [i, item] of c.items.entries()) {
      await db.portfolioItem.create({
        data: {
          candidateProfileId: profile.id,
          title: item.title,
          description: item.description,
          tags: item.tags,
          position: i,
        },
      });
    }

    const byKind = new Map<string, number>();
    for (const entry of c.experience) {
      const position = byKind.get(entry.kind) ?? 0;
      byKind.set(entry.kind, position + 1);

      await db.experienceEntry.create({
        data: {
          candidateProfileId: profile.id,
          kind: entry.kind,
          organization: entry.organization,
          role: entry.role,
          startDate: entry.startDate,
          endDate: entry.endDate || null,
          description: entry.description || null,
          position,
        },
      });
    }
  }

  console.log(`Seed complete. Test accounts (password: ${PASSWORD}):`);
  console.log("  recruiter1@test.com (recruiter)");
  console.log("  candidate1@test.com .. candidate4@test.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
