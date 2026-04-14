import { PrismaClient } from "../lib/generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"
import * as dotenv from "dotenv"

dotenv.config()

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const JOBS = [
  {
    title: "Business Development Intern",
    type: "Internship",
    location: "Remote",
    duration: "3 months",
    description: "Support our BD team in identifying new market opportunities, qualifying leads, and building client relationships.",
    skills: ["Communication", "Research", "CRM Tools"],
  },
  {
    title: "Digital Marketing Associate",
    type: "Full-time",
    location: "Hybrid",
    duration: "Permanent",
    description: "Plan and execute digital campaigns across channels, track performance metrics, and optimise for growth.",
    skills: ["SEO", "Social Media", "Google Ads", "Analytics"],
  },
  {
    title: "Business Analyst",
    type: "Full-time",
    location: "On-site",
    duration: "Permanent",
    description: "Translate business needs into actionable insights, build dashboards, and drive data-informed decisions.",
    skills: ["Data Analysis", "Excel", "Power BI", "Stakeholder Mgmt"],
  },
  {
    title: "Growth & Strategy Intern",
    type: "Internship",
    location: "Remote",
    duration: "6 months",
    description: "Work directly with leadership on growth initiatives, competitive analysis, and strategic planning projects.",
    skills: ["Strategy", "Market Research", "Presentations"],
  },
]

async function main() {
  console.log("Seeding jobs...")
  for (const job of JOBS) {
    await prisma.job.upsert({
      where: { id: job.title },
      update: job,
      create: job,
    })
  }
  console.log("Done.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
