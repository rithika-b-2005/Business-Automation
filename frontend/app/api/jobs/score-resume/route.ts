import { NextResponse } from "next/server"
import { jobQueue } from "@/lib/job-queue"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const companyName = (formData.get("companyName") as string | null)?.trim() || "Tec Tha"
    const jobTitle = (formData.get("jobTitle") as string | null)?.trim() || "Open Role"
    const jobDescription = (formData.get("jobDescription") as string | null)?.trim()
    const jobSkillsRaw = (formData.get("jobSkills") as string | null)?.trim() || ""
    const resumeFile = formData.get("resume") as File | null

    if (!jobDescription) {
      return NextResponse.json({ error: "jobDescription is required." }, { status: 400 })
    }

    if (!resumeFile || resumeFile.size === 0) {
      return NextResponse.json({ error: "Resume file is required." }, { status: 400 })
    }

    // Create a new job
    const jobId = jobQueue.createJob()

    const buffer = Buffer.from(await resumeFile.arrayBuffer())
    const fileName = resumeFile.name || "resume.pdf"

    const jobContext = {
      companyName,
      jobTitle,
      jobDescription,
      jobSkills: jobSkillsRaw
        .split(",")
        .map((skill: string) => skill.trim())
        .filter(Boolean),
    }

    // Start processing in background (don't await)
    jobQueue.processJob(jobId, buffer, fileName, jobContext).catch((err) => {
      console.error(`Failed to process job ${jobId}:`, err)
    })

    // Return immediately with job ID
    return NextResponse.json({
      jobId,
      status: "pending",
      message: "Resume analysis started. Use the jobId to check status.",
    })
  } catch (err) {
    console.error("[jobs/score-resume POST]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to start analysis." },
      { status: 500 },
    )
  }
}
