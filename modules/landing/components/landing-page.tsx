import dynamic from "next/dynamic";
import { Navbar } from "./navbar";
import { HeroSection } from "./hero-section";
import { StatsSection } from "./stats-section";
import { Footer } from "./footer";

// Below-the-fold sections: code-split out of the initial bundle so their
// (animation/video-heavy) JS doesn't add to first-load script evaluation time.
const RevenueStreamSection = dynamic(() =>
  import("./revenue-stream-section").then((m) => m.RevenueStreamSection)
);
const PricingSection = dynamic(() =>
  import("./pricing-section").then((m) => m.PricingSection)
);
const ValuationSection = dynamic(() =>
  import("./valuation-section").then((m) => m.ValuationSection)
);
const DeidentificationSection = dynamic(() =>
  import("./deidentification-section").then((m) => m.DeidentificationSection)
);
const BuyersSection = dynamic(() =>
  import("./buyers-section").then((m) => m.BuyersSection)
);
const IndustriesSection = dynamic(() =>
  import("./industries-section").then((m) => m.IndustriesSection)
);
const CtaSection = dynamic(() =>
  import("./cta-section").then((m) => m.CtaSection)
);

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
