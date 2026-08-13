import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/*
          THESIS: One console, read like a fine periodical — the Press Room
          turns open disaster data into a quietly cinematic editorial desk, and
          refuses the generic blue data-dashboard default.
          OWN-WORLD: Warm ivory paper stock, champagne-gold hairlines and
          numerals, charcoal plate chrome; a serif masthead over a tailored
          grotesk; film-still photography slots; slow, deliberate motion.
          STORY: A visitor reads the nation's disaster ledger as an editorial
          feature — then opens the console and operates it like an instrument.
          FIRST VIEWPORT: Editorial hero — serif headline on ivory with a
          gold kicker, a cinematic film-still slot, and a charcoal folio spine
          behind the console.
          FORM: User-pinned visual world (roll key 28b3f213 dealt challengers;
          the pinned brief beats the roll, always).
          FINISH: unreviewed and undocumented is unfinished; this build ends
          with the finish review, the verdict, and DESIGN.md
        */}
        {children}
        <div className="noise-layer" aria-hidden="true" />
      </body>
    </html>
  );
}
