import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";
import CustomCursor from "@/components/layout/CustomCursor";
import GrainOverlay from "@/components/layout/GrainOverlay";
import ScrollProgress from "@/components/layout/ScrollProgress";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nexusbio.tech'),
  title: "NEXUSBIO — Architecting Molecular Intelligence",
  description: "Nexus Bio develops programmable therapeutics and molecular dynamics simulations to program genetic logic and accelerate clinical translation.",
  openGraph: {
    title: "NEXUSBIO — Architecting Molecular Intelligence",
    description: "Nexus Bio develops programmable therapeutics and molecular dynamics simulations to program genetic logic and accelerate clinical translation.",
    type: "website",
    url: "https://nexusbio.tech", // Placeholder URL representing the brand domain
    siteName: "NEXUSBIO",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUSBIO — Architecting Molecular Intelligence",
    description: "Nexus Bio develops programmable therapeutics and molecular dynamics simulations to program genetic logic and accelerate clinical translation.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-accent-teal/30 selection:text-accent-teal">
        <Preloader />
        <CustomCursor />
        <GrainOverlay />
        <SmoothScrollProvider>
          <Navbar />
          <ScrollProgress />
          <main className="flex-grow pt-20 relative z-10">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
