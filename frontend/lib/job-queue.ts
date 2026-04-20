import { parseAndScoreResume, ResumeScoreResult } from "./resume-scoring"

export interface JobStatus {
  id: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  result?: ResumeScoreResult
  error?: string
  createdAt: number
  startedAt?: number
  completedAt?: number
}

class JobQueue {
  private jobs = new Map<string, JobStatus>()

  createJob(): string {
    const id = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    this.jobs.set(id, {
      id,
      status: "pending",
      progress: 0,
      createdAt: Date.now(),
    })
    return id
  }

  getJob(id: string): JobStatus | undefined {
    return this.jobs.get(id)
  }

  async processJob(
    jobId: string,
    buffer: Buffer,
    fileName: string,
    context: any
  ): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job) return

    try {
      job.status = "processing"
      job.startedAt = Date.now()
      job.progress = 10

      console.log(`[Job ${jobId}] Starting resume analysis...`)

      const result = await parseAndScoreResume(buffer, fileName, context)

      job.result = result
      job.status = "completed"
      job.progress = 100
      job.completedAt = Date.now()

      console.log(`[Job ${jobId}] Completed successfully`)
    } catch (error) {
      job.status = "failed"
      job.error = error instanceof Error ? error.message : String(error)
      job.progress = 0
      job.completedAt = Date.now()

      console.error(`[Job ${jobId}] Failed:`, job.error)
    }
  }

  // Cleanup old jobs (older than 1 hour)
  cleanup(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    for (const [id, job] of this.jobs.entries()) {
      if (
        job.completedAt &&
        job.completedAt < oneHourAgo &&
        job.status !== "processing"
      ) {
        this.jobs.delete(id)
      }
    }
  }
}

export const jobQueue = new JobQueue()

// Cleanup every 10 minutes
setInterval(() => {
  jobQueue.cleanup()
}, 10 * 60 * 1000)
