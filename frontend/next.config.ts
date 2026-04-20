import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pdf-parse",
    "jose",
    "openai",
    "tesseract.js",
    "pdf2pic",
    "jszip",
    "mammoth",
    "groq-sdk",
  ],
};

export default nextConfig;
