import { Navbar } from "@/modules/landing/components/navbar";
import { CtaSection } from "@/modules/landing/components/cta-section";
import { Footer } from "@/modules/landing/components/footer";
import { GRAIN_TEXTURE_STYLE } from "../lib/assets";
import { AboutHero } from "./about-hero";
import { PurposeAndGrowthSections } from "./purpose-and-growth-sections";

export function AboutPage() {
  return (
    <div className="flex flex-col">
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <AboutHero />
        <PurposeAndGrowthSections />
        <CtaSection topBandClassName="bg-[#fcfcfc]" topBandStyle={GRAIN_TEXTURE_STYLE} />
      </main>
      <Footer />
    </div>
  );
}
