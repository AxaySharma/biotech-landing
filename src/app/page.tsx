import Hero from "@/components/sections/Hero";
import Partners from "@/components/sections/Partners";
import About from "@/components/sections/About";
import Technology from "@/components/sections/Technology";
import Capabilities from "@/components/sections/Capabilities";
import Stats from "@/components/sections/Stats";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Partners />
      <About />
      <Technology />
      <Capabilities />
      <Stats />
      <FinalCTA />
    </>
  );
}