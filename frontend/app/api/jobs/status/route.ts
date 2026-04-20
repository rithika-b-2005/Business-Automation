import { NextResponse } from "next/server"
import { jobQueue } from "@/lib/job-queue"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json({ error: "jobId parameter is required." }, { status: 400 })
    }

    const job = jobQueue.getJob(jobId)

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (err) {
    console.error("[jobs/status GET]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to get job status." },
      { status: 500 },
    )
  }
}
