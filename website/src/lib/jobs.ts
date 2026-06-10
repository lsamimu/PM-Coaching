import jobsData from "@/data/jobs.json";

export type Job = {
  role: string;
  company: string;
  level: string;
  link: string;
  location: string;
  posted: string;
  source: string;
  summary: string;
  category: JobCategory;
};

export type JobCategory =
  | "PM Internships"
  | "Associate PM Roles"
  | "Product Analyst Roles"
  | "Full-Time PM Roles";

export const JOB_CATEGORIES: JobCategory[] = [
  "PM Internships",
  "Associate PM Roles",
  "Product Analyst Roles",
  "Full-Time PM Roles",
];

export type JobsExport = {
  generated_at: string;
  count: number;
  categories: Record<JobCategory, number>;
  jobs: Job[];
};

export function getJobs(): JobsExport {
  return jobsData as JobsExport;
}
