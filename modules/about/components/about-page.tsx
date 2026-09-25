import { Navbar } from "@/modules/landing/components/navbar";
import { CtaSection } from "@/modules/landing/components/cta-section";
import { Footer } from "@/modules/landing/components/footer";
import { AboutHero } from "./about-hero";
import { OurStorySection } from "./our-story-section";
import { PurposeAndGrowthSections } from "./purpose-and-growth-sections";

export function AboutPage() {
  return (
    <div className="flex flex-col">
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <AboutHero />
        <OurStorySection />
        <PurposeAndGrowthSections />
        <CtaSection topBandImageSrc="/images/grain-light-texture.svg" topBandImageRepeat />
      </main>
      <Footer />
    </div>
  );
}
