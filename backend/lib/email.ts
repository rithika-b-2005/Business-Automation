import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const ADMIN_EMAIL = process.env.GMAIL_USER ?? "tecthaofficial@gmail.com"
const FROM = `"Tec Tha" <${ADMIN_EMAIL}>`

/* ── shared header / footer ── */
function header(title: string, subtitle = "") {
  return `
  <div style="background:linear-gradient(105deg,#0a1628,#1a56db);padding:24px 32px;border-radius:12px 12px 0 0;">
    <h2 style="color:#fff;margin:0;font-size:20px;font-weight:600;">${title}</h2>
    ${subtitle ? `<p style="color:rgba(255,255,255,.6);margin:4px 0 0;font-size:13px;">${subtitle}</p>` : ""}
  </div>`
}
function footer(ts: string) {
  return `<p style="margin-top:20px;font-size:12px;color:#9ca3af;text-align:center;">Received on ${ts} IST</p>`
}
function wrap(inner: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">${inner}</div>`
}
function body(content: string, ts: string) {
  return `<div style="background:#f9fafb;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">${content}${footer(ts)}</div>`
}
function ts() {
  return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
}

/* ─────────────────────────────────────────────
   1. Welcome email → new user after registration
───────────────────────────────────────────── */
export async function sendWelcomeEmail(to: string, firstName: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Welcome to Tec Tha — You're all set!",
    html: wrap(`
      ${header("Welcome to Tec Tha! 🎉", "You have successfully registered")}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          You have successfully registered on <strong>Tec Tha</strong> — the all-in-one business automation platform.
          Your account is now active and ready to use.
        </p>
        <div style="margin:20px 0;padding:16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
          <p style="font-size:13px;color:#1e40af;margin:0;font-weight:600;">What's next?</p>
          <ul style="font-size:13px;color:#374151;margin:8px 0 0;padding-left:18px;line-height:1.8;">
            <li>Explore our products at <a href="https://tectha.ai/explore" style="color:#1a56db;">tectha.ai/explore</a></li>
            <li>Book a free demo to see automation in action</li>
            <li>Reach us at tecthaofficial@gmail.com for any help</li>
          </ul>
        </div>
        <p style="font-size:13px;color:#6b7280;">The Tec Tha Team</p>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   2. Admin alert — new registration
───────────────────────────────────────────── */
export async function sendRegistrationAlertEmail(user: {
  firstName: string; lastName: string; email: string; company?: string | null
}) {
  await transporter.sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Registration — ${user.firstName} ${user.lastName}`,
    html: wrap(`
      ${header("New User Registered", "Via Tec Tha website")}
      ${body(`
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;width:140px;">Name</td><td style="padding:8px 0;font-size:13px;color:#111827;font-weight:600;">${user.firstName} ${user.lastName}</td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Email</td><td style="padding:8px 0;font-size:13px;"><a href="mailto:${user.email}" style="color:#1a56db;">${user.email}</a></td></tr>
          ${user.company ? `<tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Company</td><td style="padding:8px 0;font-size:13px;color:#111827;">${user.company}</td></tr>` : ""}
        </table>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   3. Admin alert — demo booking
───────────────────────────────────────────── */
export async function sendDemoAlertEmail(booking: {
  id: string; firstName: string; lastName: string; email: string
  company?: string | null; companySize?: string | null
  date: string; timeSlot: string; message?: string | null
}) {
  await transporter.sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Demo Booking — ${booking.firstName} ${booking.lastName}`,
    html: wrap(`
      ${header("New Demo Booking", "Via Tec Tha website")}
      ${body(`
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;width:140px;">Booking ID</td><td style="padding:8px 0;font-size:12px;color:#6b7280;font-family:monospace;">${booking.id}</td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Name</td><td style="padding:8px 0;font-size:13px;color:#111827;font-weight:600;">${booking.firstName} ${booking.lastName}</td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Email</td><td style="padding:8px 0;font-size:13px;"><a href="mailto:${booking.email}" style="color:#1a56db;">${booking.email}</a></td></tr>
          ${booking.company ? `<tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Company</td><td style="padding:8px 0;font-size:13px;color:#111827;">${booking.company}</td></tr>` : ""}
          ${booking.companySize ? `<tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Company Size</td><td style="padding:8px 0;font-size:13px;color:#111827;">${booking.companySize}</td></tr>` : ""}
          <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Date</td><td style="padding:8px 0;font-size:13px;color:#111827;font-weight:600;">${booking.date}</td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Time</td><td style="padding:8px 0;font-size:13px;color:#111827;">${booking.timeSlot} IST</td></tr>
        </table>
        ${booking.message ? `
        <div style="margin-top:16px;padding:14px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;">
          <p style="font-size:12px;color:#6b7280;margin:0 0 6px;text-transform:uppercase;letter-spacing:.05em;">Message</p>
          <p style="font-size:14px;color:#374151;margin:0;line-height:1.6;">${booking.message.replace(/\n/g, "<br/>")}</p>
        </div>` : ""}
        <div style="margin-top:20px;padding:14px;background:#fefce8;border:1px solid #fde68a;border-radius:8px;">
          <p style="font-size:13px;color:#92400e;margin:0;">
            <strong>Action required:</strong> Reply <strong>YES ${booking.id.slice(-8)}</strong> on Telegram to confirm, or <strong>NO ${booking.id.slice(-8)}</strong> to decline.
          </p>
        </div>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   4. Demo confirmed → user (with Google Meet link)
───────────────────────────────────────────── */
export async function sendDemoConfirmedEmail(booking: {
  firstName: string; email: string; date: string; timeSlot: string; meetLink: string
}) {
  await transporter.sendMail({
    from: FROM,
    to: booking.email,
    subject: "Your Tec Tha Demo is Confirmed!",
    html: wrap(`
      ${header("Demo Confirmed ✓", "We're looking forward to meeting you")}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi <strong>${booking.firstName}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          Great news — your demo has been <strong>confirmed</strong>!
        </p>
        <div style="margin:20px 0;padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
          <p style="font-size:13px;color:#166534;margin:0 0 8px;font-weight:600;">Session Details</p>
          <p style="font-size:14px;color:#374151;margin:0;line-height:1.8;">
            📅 <strong>${booking.date}</strong><br/>
            ⏰ <strong>${booking.timeSlot} IST</strong> · 30-minute session<br/>
            📹 <strong>Google Meet</strong> — <a href="${booking.meetLink}" style="color:#1a56db;">${booking.meetLink}</a>
          </p>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="${booking.meetLink}"
            style="display:inline-block;background:#1a56db;color:#fff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
            Join Google Meet
          </a>
        </div>
        <p style="font-size:13px;color:#6b7280;">See you there! — The Tec Tha Team</p>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   5. Demo declined → ask user to reschedule
───────────────────────────────────────────── */
export async function sendDemoRescheduleEmail(booking: {
  firstName: string; email: string; date: string; timeSlot: string
}) {
  await transporter.sendMail({
    from: FROM,
    to: booking.email,
    subject: "Your Tec Tha Demo — Please Reschedule",
    html: wrap(`
      ${header("Demo Rescheduling Needed", "We're sorry for the inconvenience")}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi <strong>${booking.firstName}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          Unfortunately, our team is unavailable for your requested slot on <strong>${booking.date} at ${booking.timeSlot} IST</strong>.
          We apologize for the inconvenience.
        </p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          Please <a href="https://tectha.ai/demo" style="color:#1a56db;font-weight:600;">book a new time slot</a> that works for you, and we will confirm it promptly.
        </p>
        <p style="font-size:13px;color:#6b7280;">Thank you for your patience — The Tec Tha Team</p>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   6. Admin alert — job application with match score
───────────────────────────────────────────── */
export async function sendJobApplicationEmail(opts: {
  applicant: { firstName: string; lastName: string; email: string; phone?: string | null }
  job: { title: string }
  matchScore: number
  strengths: string[]
  gaps: string[]
  resumeBuffer?: Buffer
  resumeFilename?: string
}) {
  const { applicant, job, matchScore, strengths, gaps, resumeBuffer, resumeFilename } = opts

  const scoreColor = matchScore >= 70 ? "#166534" : matchScore >= 40 ? "#92400e" : "#991b1b"
  const scoreBg = matchScore >= 70 ? "#f0fdf4" : matchScore >= 40 ? "#fefce8" : "#fef2f2"
  const scoreBorder = matchScore >= 70 ? "#bbf7d0" : matchScore >= 40 ? "#fde68a" : "#fecaca"

  await transporter.sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Job Application — ${applicant.firstName} ${applicant.lastName} (Match: ${matchScore}%)`,
    html: wrap(`
      ${header("New Job Application", `Role: ${job.title}`)}
      ${body(`
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;width:140px;">Applicant</td><td style="padding:8px 0;font-size:13px;color:#111827;font-weight:600;">${applicant.firstName} ${applicant.lastName}</td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Email</td><td style="padding:8px 0;font-size:13px;"><a href="mailto:${applicant.email}" style="color:#1a56db;">${applicant.email}</a></td></tr>
          ${applicant.phone ? `<tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Phone</td><td style="padding:8px 0;font-size:13px;color:#111827;">${applicant.phone}</td></tr>` : ""}
          <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Role</td><td style="padding:8px 0;font-size:13px;color:#111827;">${job.title}</td></tr>
        </table>
        <div style="margin:20px 0;padding:16px;background:${scoreBg};border:1px solid ${scoreBorder};border-radius:8px;text-align:center;">
          <p style="font-size:12px;color:${scoreColor};margin:0 0 4px;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">AI Match Score</p>
          <p style="font-size:40px;color:${scoreColor};margin:0;font-weight:700;">${matchScore}%</p>
        </div>
        ${strengths.length ? `
        <div style="margin-bottom:12px;">
          <p style="font-size:12px;color:#6b7280;margin:0 0 6px;font-weight:600;">Strengths</p>
          <ul style="font-size:13px;color:#374151;margin:0;padding-left:18px;line-height:1.8;">
            ${strengths.map(s => `<li>${s}</li>`).join("")}
          </ul>
        </div>` : ""}
        ${gaps.length ? `
        <div>
          <p style="font-size:12px;color:#6b7280;margin:0 0 6px;font-weight:600;">Gaps / Missing Skills</p>
          <ul style="font-size:13px;color:#374151;margin:0;padding-left:18px;line-height:1.8;">
            ${gaps.map(g => `<li>${g}</li>`).join("")}
          </ul>
        </div>` : ""}
      `, ts())}
    `),
    attachments: resumeBuffer
      ? [{ filename: resumeFilename ?? "resume.pdf", content: resumeBuffer, contentType: "application/pdf" }]
      : [],
  })
}

/* ─────────────────────────────────────────────
   7. Contact auto-reply → user
───────────────────────────────────────────── */
export async function sendContactAutoReply(to: string, firstName: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "We received your message — Tec Tha",
    html: wrap(`
      ${header("Message Received!", "We will be in touch soon")}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          Thank you for reaching out! We have received your message and our team will reply within <strong>24 hours</strong>.
        </p>
        <div style="margin:20px 0;padding:16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
          <p style="font-size:13px;color:#1e40af;margin:0;">
            For urgent matters, reach us directly at
            <a href="mailto:tecthaofficial@gmail.com" style="color:#1a56db;">tecthaofficial@gmail.com</a>
          </p>
        </div>
        <p style="font-size:13px;color:#6b7280;">The Tec Tha Team</p>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   8. Job application acknowledgment → applicant
───────────────────────────────────────────── */
export async function sendJobApplicationAck(to: string, firstName: string, jobTitle: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Application Received — ${jobTitle}`,
    html: wrap(`
      ${header("Application Received!", `Role: ${jobTitle}`)}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          Thank you for applying for the <strong>${jobTitle}</strong> position at Tec Tha. We have received your application and our team will review it shortly.
        </p>
        <div style="margin:20px 0;padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
          <p style="font-size:13px;color:#166534;margin:0 0 6px;font-weight:600;">What happens next?</p>
          <ul style="font-size:13px;color:#374151;margin:0;padding-left:18px;line-height:1.8;">
            <li>Our AI system analyzes your profile against the role requirements</li>
            <li>Our team reviews shortlisted candidates within 3–5 business days</li>
            <li>We will contact you via email with next steps</li>
          </ul>
        </div>
        <p style="font-size:13px;color:#6b7280;">Good luck! — The Tec Tha Team</p>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   9. Auto interview invite → applicant (score > 70%)
───────────────────────────────────────────── */
export async function sendInterviewInvite(to: string, firstName: string, jobTitle: string, matchScore: number) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Interview Invitation — ${jobTitle} at Tec Tha`,
    html: wrap(`
      ${header("You're Shortlisted! 🎉", `Role: ${jobTitle}`)}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          Congratulations! Your application for <strong>${jobTitle}</strong> stood out and we would love to schedule an interview with you.
        </p>
        <div style="margin:20px 0;padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;text-align:center;">
          <p style="font-size:12px;color:#166534;margin:0 0 4px;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">Profile Match</p>
          <p style="font-size:36px;color:#166534;margin:0;font-weight:700;">${matchScore}%</p>
        </div>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          Please reply to this email with your availability for a 30-minute call this week or next, and we will send you a calendar invite with a Google Meet link.
        </p>
        <p style="font-size:13px;color:#6b7280;">We look forward to speaking with you! — The Tec Tha Hiring Team</p>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   10. Auto rejection → applicant (score < 30%)
───────────────────────────────────────────── */
export async function sendApplicationRejection(to: string, firstName: string, jobTitle: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Your Application — ${jobTitle} at Tec Tha`,
    html: wrap(`
      ${header("Thank You for Applying", `Role: ${jobTitle}`)}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          Thank you for your interest in the <strong>${jobTitle}</strong> position at Tec Tha and for taking the time to apply.
        </p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          After careful review, we have decided to move forward with candidates whose experience more closely matches our current requirements. We encourage you to apply for future openings that may be a better fit.
        </p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">We wish you the very best in your job search.</p>
        <p style="font-size:13px;color:#6b7280;">Thank you again — The Tec Tha Hiring Team</p>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   11. Follow-up email → user registered 3 days ago, no demo booked
───────────────────────────────────────────── */
export async function sendFollowUpEmail(to: string, firstName: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Still exploring automation? Book a free demo — Tec Tha",
    html: wrap(`
      ${header("See Tec Tha in Action", "Book your free 30-minute demo")}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          It has been a few days since you joined Tec Tha. Have you had a chance to explore what we can automate for your business?
        </p>
        <div style="margin:20px 0;padding:16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
          <p style="font-size:13px;color:#1e40af;margin:0 0 8px;font-weight:600;">A free demo gets you:</p>
          <ul style="font-size:13px;color:#374151;margin:0;padding-left:18px;line-height:1.8;">
            <li>A live walkthrough of your specific workflows</li>
            <li>An ROI estimate for your business</li>
            <li>No sales pressure — just real answers</li>
          </ul>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="https://tectha.ai/demo"
            style="display:inline-block;background:#1a56db;color:#fff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
            Book Your Free Demo
          </a>
        </div>
        <p style="font-size:13px;color:#6b7280;">The Tec Tha Team</p>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   12. Demo reminder → 24h and 1h before session
───────────────────────────────────────────── */
export async function sendDemoReminder(opts: {
  to: string; firstName: string; date: string; timeSlot: string
  meetLink?: string | null; hoursUntil: 24 | 1
}) {
  const { to, firstName, date, timeSlot, meetLink, hoursUntil } = opts
  const isOneHour = hoursUntil === 1
  await transporter.sendMail({
    from: FROM,
    to,
    subject: isOneHour
      ? "Your Tec Tha Demo starts in 1 hour!"
      : "Your Tec Tha Demo is tomorrow — reminder",
    html: wrap(`
      ${header(isOneHour ? "Demo in 1 Hour! ⏰" : "Demo Tomorrow — Reminder", "Your session details below")}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size:14px;color:#374151;line-height:1.7;">
          ${isOneHour
            ? "Your Tec Tha demo starts <strong>in about 1 hour</strong>. Here are your details:"
            : "Just a reminder that your Tec Tha demo is <strong>tomorrow</strong>. Here are your details:"}
        </p>
        <div style="margin:20px 0;padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
          <p style="font-size:13px;color:#166534;margin:0 0 8px;font-weight:600;">Session Details</p>
          <p style="font-size:14px;color:#374151;margin:0;line-height:1.8;">
            📅 <strong>${date}</strong><br/>
            ⏰ <strong>${timeSlot} IST</strong> · 30-minute session
            ${meetLink ? `<br/>📹 <a href="${meetLink}" style="color:#1a56db;">${meetLink}</a>` : ""}
          </p>
        </div>
        ${meetLink ? `
        <div style="text-align:center;margin:24px 0;">
          <a href="${meetLink}"
            style="display:inline-block;background:#1a56db;color:#fff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
            Join Google Meet
          </a>
        </div>` : ""}
        <p style="font-size:13px;color:#6b7280;">See you soon! — The Tec Tha Team</p>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   13. OTP verification email → email registration
───────────────────────────────────────────── */
export async function sendOtpEmail(to: string, firstName: string, otp: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `${otp} is your Tec Tha verification code`,
    html: wrap(`
      ${header("Verify your email", "Complete your Tec Tha registration")}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi ${firstName},</p>
        <p style="font-size:14px;color:#6b7280;">Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        <div style="margin:24px 0;text-align:center;">
          <div style="display:inline-block;background:#f9fafb;border:2px dashed #1a56db;border-radius:12px;padding:20px 40px;">
            <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#0d2257;">${otp}</span>
          </div>
        </div>
        <p style="font-size:13px;color:#9ca3af;text-align:center;">If you didn&apos;t request this, you can safely ignore this email.</p>
      `, ts())}
    `),
  })
}

/* ─────────────────────────────────────────────
   14. Password reset OTP email
───────────────────────────────────────────── */
export async function sendPasswordResetOtpEmail(to: string, firstName: string, otp: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `${otp} — Reset your Tec Tha password`,
    html: wrap(`
      ${header("Reset your password", "You requested a password reset")}
      ${body(`
        <p style="font-size:15px;color:#374151;">Hi ${firstName},</p>
        <p style="font-size:14px;color:#6b7280;">Use the code below to reset your password. It expires in <strong>10 minutes</strong>.</p>
        <div style="margin:24px 0;text-align:center;">
          <div style="display:inline-block;background:#f9fafb;border:2px dashed #dc2626;border-radius:12px;padding:20px 40px;">
            <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#dc2626;">${otp}</span>
          </div>
        </div>
        <p style="font-size:13px;color:#9ca3af;text-align:center;">If you didn&apos;t request this, ignore this email — your password won&apos;t change.</p>
      `, ts())}
    `),
  })
}
