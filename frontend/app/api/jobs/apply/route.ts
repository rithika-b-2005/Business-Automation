import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendJobApplicationEmail, sendJobApplicationAck, sendInterviewInvite, sendApplicationRejection } from "@/lib/email"
import { sendAdminWhatsApp } from "@/lib/whatsapp"
import { GoogleGenerativeAI } from "@google/generative-ai"
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

async function scoreResumeAgainstJob(resumeText: string, jobDescription: string, jobSkills: string[]): Promise<{
  score: number; strengths: string[]; gaps: string[]
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  const prompt = `You are a recruiter assistant. Compare the candidate's resume with the job description and required skills.

JOB DESCRIPTION:
${jobDescription}

REQUIRED SKILLS: ${jobSkills.join(", ")}

RESUME:
${resumeText.slice(0, 6000)}

Rate the match from 0-100 and return ONLY valid JSON (no markdown) in this exact format:
{"score": 75, "strengths": ["strength 1", "strength 2"], "gaps": ["gap 1", "gap 2"]}`

  const result = await model.generateContent(prompt)
  const raw = result.response.text().trim()
  const jsonStr = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()
  return JSON.parse(jsonStr)
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const jobId        = formData.get("jobId") as string
    const firstName    = formData.get("firstName") as string
    const lastName     = formData.get("lastName") as string
    const email        = formData.get("email") as string
    const phone        = formData.get("phone") as string | null
    const city         = formData.get("city") as string | null
    const country      = formData.get("country") as string | null
    const linkedin     = formData.get("linkedin") as string | null
    const experience   = formData.get("experience") as string | null
    const qualification = formData.get("qualification") as string | null
    const availability = formData.get("availability") as string | null
    const company      = formData.get("company") as string | null
    const whyJoin      = formData.get("whyJoin") as string | null
    const coverLetter  = formData.get("coverLetter") as string | null
    const portfolio    = formData.get("portfolio") as string | null
    const resumeFile   = formData.get("resume") as File | null

    if (!jobId || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Job, first name, last name, and email are required." },
        { status: 400 }
      )
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 })
    }

    // Parse resume PDF if provided
    let resumeText: string | null = null
    let resumeBuffer: Buffer | undefined
    let resumeFilename: string | undefined

    if (resumeFile && resumeFile.size > 0) {
      const arrayBuffer = await resumeFile.arrayBuffer()
      resumeBuffer = Buffer.from(arrayBuffer)
      resumeFilename = resumeFile.name
      try {
        const parsed = await pdfParse(resumeBuffer)
        resumeText = parsed.text
      } catch (e) {
        console.warn("[jobs/apply] PDF parse failed:", e)
      }
    }

    // AI match score
    let matchScore = 0
    let strengths: string[] = []
    let gaps: string[] = []

    if (resumeText) {
      try {
        const result = await scoreResumeAgainstJob(resumeText, job.description, job.skills)
        matchScore = result.score
        strengths  = result.strengths
        gaps       = result.gaps
      } catch (e) {
        console.warn("[jobs/apply] Gemini scoring failed:", e)
      }
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId, firstName, lastName, email,
        phone: phone || null,
        city: city || null,
        country: country || null,
        linkedin: linkedin || null,
        experience: experience || null,
        qualification: qualification || null,
        availability: availability || null,
        company: company || null,
        whyJoin: whyJoin || null,
        coverLetter: coverLetter || null,
        portfolio: portfolio || null,
        resumeText: resumeText || null,
        matchScore: resumeText ? matchScore : null,
      },
    })

    const scoreLabel = resumeText ? `${matchScore}%` : "N/A (no resume)"
    Promise.allSettled([
      // Admin notifications
      sendJobApplicationEmail({ applicant: { firstName, lastName, email, phone }, job: { title: job.title }, matchScore, strengths, gaps, resumeBuffer, resumeFilename }),
      sendAdminWhatsApp(`New Job Application\nRole: ${job.title}\nApplicant: ${firstName} ${lastName}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\nAI Match Score: ${scoreLabel}${strengths.length ? `\nStrengths: ${strengths.slice(0, 2).join(", ")}` : ""}${gaps.length ? `\nGaps: ${gaps.slice(0, 2).join(", ")}` : ""}`),
      // Agent 3: acknowledgment to applicant
      sendJobApplicationAck(email, firstName, job.title),
      // Agent 4: auto interview invite if score > 70%
      ...(resumeText && matchScore > 70 ? [sendInterviewInvite(email, firstName, job.title, matchScore)] : []),
      // Agent 5: auto rejection if score < 30%
      ...(resumeText && matchScore < 30 ? [sendApplicationRejection(email, firstName, job.title)] : []),
    ]).catch(() => {})

    return NextResponse.json({ application }, { status: 201 })
  } catch (err) {
    console.error("[jobs/apply POST]", err)
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 })
  }
}
