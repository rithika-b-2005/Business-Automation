import Groq from "groq-sdk"
import OpenAI from "openai"
import { writeFileSync, unlinkSync, readFileSync } from "fs"
import { join } from "path"
import { randomBytes } from "crypto"
import Tesseract from "tesseract.js"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export type ResumeScoreResult = {
  score: number
  strengths: string[]
  gaps: string[]
  extractedText: string
}

export type ResumeJobContext = {
  companyName?: string
  jobTitle?: string
  jobDescription: string
  jobSkills?: string[]
}

function cleanModelJson(raw: string) {
  return raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
}

function clampScore(value: unknown) {
  const score = Number.parseInt(String(value ?? 0), 10)
  if (Number.isNaN(score)) return 0
  return Math.max(0, Math.min(100, score))
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  let tempFilePath: string | null = null;
  try {
    // Write buffer to temp file for pdf-parse to read
    const tempFileName = `resume-${randomBytes(8).toString("hex")}.pdf`;
    tempFilePath = join("/tmp", tempFileName);
    writeFileSync(tempFilePath, buffer);

    // Use pdf-parse PDFParse class with file URL
    // eslint-disable-next-line global-require
    const { PDFParse } = require("pdf-parse");

    const fileUrl = `file://${tempFilePath}`;
    const parser = new PDFParse({ verbosity: 0 });
    await parser.load(fileUrl);

    const text = await parser.getText();

    if (text && text.trim()) {
      console.log("PDF text extraction successful, text length:", text.length);
      return text.trim();
    }

    throw new Error("PDF text extraction returned empty");
  } catch (error) {
    console.warn("PDF text extraction failed, attempting OCR:", error);
    // Fall back to OCR for scanned PDFs
    return extractTextFromPdfWithOCR(buffer);
  } finally {
    if (tempFilePath) {
      try {
        unlinkSync(tempFilePath);
      } catch (e) {
        console.warn("Failed to delete temp file:", e);
      }
    }
  }
}

async function extractTextFromPdfWithOCR(buffer: Buffer): Promise<string> {
  let tempImgDir: string | null = null;

  try {
    console.log("Starting OCR extraction for scanned/image-based PDF...");

    // Use pdf2pic to convert PDF buffer to images
    // eslint-disable-next-line global-require
    const pdf2pic = require("pdf2pic");

    tempImgDir = join("/tmp", `resume-imgs-${randomBytes(8).toString("hex")}`);

    const options = {
      density: 150,
      savedir: tempImgDir,
      format: "png",
      width: 1920,
      height: 2560,
    };

    console.log("Converting PDF to images...");

    const result = await pdf2pic.fromBuffer(buffer, options);
    console.log(`Converted PDF to image(s)`);

    let fullText = "";

    // If result is an array, process all pages; if single object, process one
    const pages = Array.isArray(result) ? result : [result];
    const maxPages = Math.min(pages.length, 5); // Limit to first 5 pages for speed

    // Run OCR on each image
    for (let i = 0; i < maxPages; i++) {
      try {
        console.log(`Running OCR on page ${i + 1}/${maxPages}...`);
        const imagePath = pages[i].path;

        const ocrResult = await Tesseract.recognize(imagePath, "eng", {
          logger: (m: any) => {
            if (m.status === "recognizing text") {
              console.log(
                `  Page ${i + 1} OCR: ${(m.progress * 100).toFixed(0)}%`
              );
            }
          },
        });

        fullText += ocrResult.data.text + "\n";

        // Cleanup individual image
        try {
          unlinkSync(imagePath);
        } catch (e) {
          console.warn(`Failed to delete image ${i + 1}`);
        }
      } catch (pageError) {
        console.warn(`OCR failed for page ${i + 1}:`, pageError);
      }
    }

    console.log("OCR extraction completed, text length:", fullText.length);

    if (!fullText || fullText.trim().length < 20) {
      throw new Error("OCR extracted minimal text - PDF may be blank or corrupted");
    }

    return fullText.trim();
  } catch (error) {
    console.error("OCR extraction failed:", error);
    throw new Error(
      `OCR extraction failed: ${error instanceof Error ? error.message : String(error)}`
    );
  } finally {
    // Cleanup temp directory
    if (tempImgDir) {
      try {
        const fsModule = require("fs");
        if (fsModule.existsSync(tempImgDir)) {
          const files = fsModule.readdirSync(tempImgDir);
          for (const file of files) {
            fsModule.unlinkSync(join(tempImgDir, file));
          }
          fsModule.rmdirSync(tempImgDir);
        }
      } catch (e) {
        console.warn("Failed to cleanup image directory:", e);
      }
    }
  }
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    console.log("Starting DOCX extraction...");

    // Use mammoth.js if available, else use a fallback
    try {
      // eslint-disable-next-line global-require
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });

      if (result.value && result.value.trim()) {
        console.log("DOCX extraction successful");
        return result.value.trim();
      }
    } catch (e) {
      console.warn("Mammoth extraction failed, trying alternative...");
    }

    // Fallback: try to extract text from DOCX as ZIP and parse XML
    // eslint-disable-next-line global-require
    const JSZip = require("jszip");
    const zip = new JSZip();
    await zip.loadAsync(buffer);

    const docXml = zip.file("word/document.xml");
    if (docXml) {
      const content = await docXml.async("string");
      // Simple regex to extract text from XML
      const text = content
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();

      if (text) {
        console.log("DOCX fallback extraction successful");
        return text;
      }
    }

    throw new Error("Could not extract text from DOCX");
  } catch (error) {
    console.error("DOCX extraction failed:", error);
    throw error;
  }
}

function extractTextFromTxt(buffer: Buffer): string {
  const text = buffer.toString("utf-8").trim();
  if (!text) {
    throw new Error("TXT file is empty");
  }
  console.log("TXT extraction successful");
  return text;
}

export async function extractResumeTextFromFile(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error("Empty file received");
    }

    const ext = fileName.toLowerCase().split(".").pop() || "";
    console.log(`Extracting text from file: ${fileName} (type: ${ext})`);

    switch (ext) {
      case "pdf":
        return await extractTextFromPdf(buffer);

      case "docx":
      case "doc":
        return await extractTextFromDocx(buffer);

      case "txt":
        return extractTextFromTxt(buffer);

      default:
        // Try PDF first, then DOCX, then TXT
        try {
          return await extractTextFromPdf(buffer);
        } catch (e1) {
          try {
            return await extractTextFromDocx(buffer);
          } catch (e2) {
            return extractTextFromTxt(buffer);
          }
        }
    }
  } catch (error) {
    console.error("File extraction failed:", error);
    throw new Error(
      `Failed to extract text from file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Keep old function for backwards compatibility
export async function extractResumeTextFromPdf(buffer: Buffer): Promise<string> {
  return extractResumeTextFromFile(buffer, "resume.pdf");
}

export async function scoreResumeWithOpenAI(
  resumeText: string,
  context: ResumeJobContext,
): Promise<Omit<ResumeScoreResult, "extractedText">> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.")
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 600,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a recruiter assistant. Compare a candidate resume against a job opening and return ONLY valid JSON.",
      },
      {
        role: "user",
        content: `Compare this resume against the job opening and return ONLY valid JSON.

COMPANY:
${context.companyName || "Tec Tha"}

JOB TITLE:
${context.jobTitle || "Open Role"}

JOB DESCRIPTION:
${context.jobDescription}

REQUIRED SKILLS:
${(context.jobSkills ?? []).join(", ") || "Not provided"}

RESUME:
${resumeText.slice(0, 12000)}

Return exactly this JSON shape:
{"score":75,"strengths":["strength 1","strength 2"],"gaps":["gap 1","gap 2"]}`,
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content ?? "{}"
  const parsed = JSON.parse(raw) as {
    score?: number
    strengths?: string[]
    gaps?: string[]
  }

  return {
    score: clampScore(parsed.score),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.filter(Boolean).slice(0, 5) : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps.filter(Boolean).slice(0, 5) : [],
  }
}

export async function scoreResumeWithGroq(
  resumeText: string,
  context: ResumeJobContext,
): Promise<Omit<ResumeScoreResult, "extractedText">> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.")
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
    max_tokens: 600,
    messages: [
      {
        role: "system",
        content:
          "You are a recruiter assistant. Compare a candidate resume against a job opening and return ONLY valid JSON.",
      },
      {
        role: "user",
        content: `Compare this resume against the job opening and return ONLY valid JSON.

COMPANY:
${context.companyName || "Tec Tha"}

JOB TITLE:
${context.jobTitle || "Open Role"}

JOB DESCRIPTION:
${context.jobDescription}

REQUIRED SKILLS:
${(context.jobSkills ?? []).join(", ") || "Not provided"}

RESUME:
${resumeText.slice(0, 12000)}

Return exactly this JSON shape:
{"score":75,"strengths":["strength 1","strength 2"],"gaps":["gap 1","gap 2"]}`,
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content ?? "{}"
  const parsed = JSON.parse(cleanModelJson(raw)) as {
    score?: number
    strengths?: string[]
    gaps?: string[]
  }

  return {
    score: clampScore(parsed.score),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.filter(Boolean).slice(0, 5) : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps.filter(Boolean).slice(0, 5) : [],
  }
}

export async function parseAndScoreResume(
  buffer: Buffer,
  fileName: string,
  context: ResumeJobContext,
): Promise<ResumeScoreResult> {
  const extractedText = await extractResumeTextFromFile(buffer, fileName)

  if (!extractedText) {
    throw new Error("Resume text extraction failed.")
  }

  // Prefer OpenAI for speed and reliability as requested
  const scored = process.env.OPENAI_API_KEY
    ? await scoreResumeWithOpenAI(extractedText, context)
    : await scoreResumeWithGroq(extractedText, context)

  return { ...scored, extractedText }
}
