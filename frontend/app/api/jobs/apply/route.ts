import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendJobApplicationEmail, sendJobApplicationAck, sendInterviewInvite, sendApplicationRejection } from "@/lib/email"
import { sendAdminWhatsApp } from "@/lib/whatsapp"
import { parseAndScoreResume } from "@/lib/resume-scoring"

function normalizePhone(value: string | null) {
  const digitsOnly = (value ?? "").replace(/\D/g, "")
  return digitsOnly.length === 10 ? digitsOnly : null
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
    const providedResumeText = formData.get("resumeText") as string | null
    const providedMatchScore = formData.get("matchScore") as string | null
    const providedStrengths = formData.get("strengths") as string | null
    const providedGaps = formData.get("gaps") as string | null
    const normalizedPhone = normalizePhone(phone)

    if (!jobId || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Job, first name, last name, and email are required." },
        { status: 400 }
      )
    }

    if (!normalizedPhone) {
      return NextResponse.json({ error: "Phone number must be exactly 10 digits." }, { status: 400 })
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 })
    }

    // Parse resume PDF if provided
    let resumeText: string | null = providedResumeText || null
    let resumeBuffer: Buffer | undefined
    let resumeFilename: string | undefined
    let matchScore = providedMatchScore ? parseInt(providedMatchScore, 10) : 0
    let strengths: string[] = providedStrengths ? JSON.parse(providedStrengths) : []
    let gaps: string[] = providedGaps ? JSON.parse(providedGaps) : []
    const hasResumeUpload = Boolean(resumeFile && resumeFile.size > 0)

    if (hasResumeUpload && resumeFile && !providedResumeText) {
      const arrayBuffer = await resumeFile.arrayBuffer()
      resumeBuffer = Buffer.from(arrayBuffer)
      resumeFilename = resumeFile.name
      try {
        console.log(`[jobs/apply] Parsing resume for ${email}: ${resumeFilename}, size: ${resumeFile.size}`)
        const result = await parseAndScoreResume(resumeBuffer, resumeFilename!, {
          companyName: "Tec Tha",
          jobTitle: job.title,
          jobDescription: job.description,
          jobSkills: job.skills,
        })

        resumeText = result.extractedText
        matchScore = result.score
        strengths = result.strengths
        gaps = result.gaps
        console.log(`[jobs/apply] Resume parsed successfully for ${email}: score ${matchScore}, text length ${resumeText?.length}`)
      } catch (e) {
        console.error(`[jobs/apply] Resume parse/score failed for ${email}:`, e)
      }
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId, firstName, lastName, email,
        phone: normalizedPhone,
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
        matchScore: hasResumeUpload ? matchScore : null,
      },
    })

    const scoreLabel = hasResumeUpload ? `${matchScore}%` : "N/A (no resume)"
    Promise.allSettled([
      // Admin notifications
      sendJobApplicationEmail({ applicant: { firstName, lastName, email, phone: normalizedPhone }, job: { title: job.title }, matchScore, strengths, gaps, resumeBuffer, resumeFilename }),
      sendAdminWhatsApp(`New Job Application\nRole: ${job.title}\nApplicant: ${firstName} ${lastName}\nEmail: ${email}${normalizedPhone ? `\nPhone: ${normalizedPhone}` : ""}\nAI Match Score: ${scoreLabel}${strengths.length ? `\nStrengths: ${strengths.slice(0, 2).join(", ")}` : ""}${gaps.length ? `\nGaps: ${gaps.slice(0, 2).join(", ")}` : ""}`),
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
