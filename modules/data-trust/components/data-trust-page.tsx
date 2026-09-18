import { Navbar } from "@/modules/landing/components/navbar";
import { CtaSection } from "@/modules/landing/components/cta-section";
import { Footer } from "@/modules/landing/components/footer";
import { HeroSection } from "@/modules/landing/components/hero-section";
import { DeidentificationPanel } from "./deidentification-panel";
import { AssuranceSection } from "./assurance-section";

export function DataTrustPage() {
  return (
    <div className="flex flex-col">
      {/* The section anchors live on the home page, so send them there. */}
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <HeroSection />
        <DeidentificationPanel />
        <AssuranceSection />
        <CtaSection sideBorderClassName="border-[#bcbcbc]" />
      </main>
      <Footer />
    </div>
  );
}
