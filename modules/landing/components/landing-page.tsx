import { Navbar } from "./navbar";
import { HeroSection } from "./hero-section";
import { StatsSection } from "./stats-section";
import { RevenueStreamSection } from "./revenue-stream-section";
import { PricingSection } from "./pricing-section";
import { ValuationSection } from "./valuation-section";
import { DeidentificationSection } from "./deidentification-section";
import { BuyersSection } from "./buyers-section";
import { IndustriesSection } from "./industries-section";
import { CtaSection } from "./cta-section";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex flex-col">
        <HeroSection />
        <StatsSection />
        <RevenueStreamSection />
        <PricingSection />
        <ValuationSection />
        <DeidentificationSection />
        <BuyersSection />
        <IndustriesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
