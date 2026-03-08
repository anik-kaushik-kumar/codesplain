import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CodeSplain — AI Code Explainer",
  description:
    "Paste code, get instant AI-powered explanations. Line-by-line breakdowns, key concepts, improvements, and simplified versions.",
  openGraph: {
    title: "CodeSplain — AI Code Explainer",
    description:
      "Paste code, get instant AI-powered explanations with Gemini.",
    type: "website",
    siteName: "CodeSplain",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeSplain — AI Code Explainer",
    description:
      "Paste code, get instant AI-powered explanations with Gemini.",
  },
  keywords: [
    "code explainer",
    "AI",
    "Gemini",
    "code analysis",
    "programming",
    "learning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
