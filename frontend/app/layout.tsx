import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const titilliumWeb = Titillium_Web({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
  variable: "--font-titillium-web",
});

export const metadata: Metadata = {
  title: "Tec Tha - Business Automation Platform",
  description: "Automate everything. Scale without limits. Tec Tha connects your entire business stack and automates repetitive workflows.",
  openGraph: {
    title: "Tec Tha - Business Automation Platform",
    description: "Automate everything. Scale without limits.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${titilliumWeb.variable} antialiased`}>
        <div className="overflow-x-clip">
          {children}
        </div>
        <Toaster position="top-right" richColors toastOptions={{ classNames: { title: "!font-normal !text-[15px]" } }} />
      </body>
    </html>
  );
}
