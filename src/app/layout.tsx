import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";
import CustomCursor from "@/components/layout/CustomCursor";
import GrainOverlay from "@/components/layout/GrainOverlay";
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
  title: "Premium Biotech Brand",
  description: "Innovative biotechnology solutions driven by research and development.",
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
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
