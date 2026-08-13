import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GENVOUCH · India Disaster Intelligence",
  description:
    "A premium analytics console by GENVOUCH TECHNOLOGIES PVT — India disaster intelligence from open government data with interactive charts, state ranking, risk scores, and an AI copilot.",
  keywords: [
    "GENVOUCH",
    "disaster management",
    "India",
    "analytics",
    "open government data",
    "dashboard",
    "Power BI",
  ],
  openGraph: {
    title: "GENVOUCH · India Disaster Intelligence",
    description:
      "A premium analytics console by GENVOUCH TECHNOLOGIES PVT — India disaster intelligence from open government data.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <div className="noise-layer" aria-hidden="true" />
      </body>
    </html>
  );
}
