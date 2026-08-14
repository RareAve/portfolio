import { z } from "zod";

export const ROLES = ["CANDIDATE", "RECRUITER"] as const;
export type Role = (typeof ROLES)[number];

export const APPLICATION_RESPONSES = ["PENDING", "ACCEPTED", "REJECTED"] as const;
export type ApplicationResponse = (typeof APPLICATION_RESPONSES)[number];

export const signupSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLES),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const candidateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  location: z.string().min(1, "Location is required"),
  skills: z.string().min(1, "List at least one skill"),
});

export const basicInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
});

export const summarySchema = z.object({
  summary: z.string().min(1, "Summary is required"),
});

export const skillsSchema = z.object({
  skills: z.string().min(1, "List at least one skill"),
});

export const recruiterProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Title is required"),
  location: z.string().optional(),
  bio: z.string().optional(),
});

export const portfolioItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  link: z.string().url().optional().or(z.literal("")),
  tags: z.string().optional().default(""),
});

export const EXPERIENCE_KINDS = [
  "EDUCATION",
  "PROFESSIONAL",
  "COMMUNITY",
] as const;
export type ExperienceKind = (typeof EXPERIENCE_KINDS)[number];

export const experienceEntrySchema = z.object({
  organization: z.string().min(1, "This field is required"),
  role: z.string().min(1, "This field is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export const EXPERIENCE_SECTION_CONFIG: Record<
  ExperienceKind,
  {
    title: string;
    organizationLabel: string;
    roleLabel: string;
    emptyHint: string;
  }
> = {
  EDUCATION: {
    title: "Education",
    organizationLabel: "School",
    roleLabel: "Degree / field of study",
    emptyHint: "No education added yet.",
  },
  PROFESSIONAL: {
    title: "Professional Experience",
    organizationLabel: "Organization",
    roleLabel: "Role",
    emptyHint: "No professional experience added yet.",
  },
  COMMUNITY: {
    title: "Community Experience",
    organizationLabel: "Organization",
    roleLabel: "Role",
    emptyHint: "No community experience added yet.",
  },
};

export const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export const jobAlertSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  description: z.string().min(1, "Description is required"),
});
