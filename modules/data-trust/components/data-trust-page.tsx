import { Navbar } from "@/modules/landing/components/navbar";
import { CtaSection } from "@/modules/landing/components/cta-section";
import { Footer } from "@/modules/landing/components/footer";
import { DataTrustHero } from "./data-trust-hero";
import { DeidentificationPanel } from "./deidentification-panel";
import { AssuranceSection } from "./assurance-section";

export function DataTrustPage() {
  return (
    <div className="flex flex-col">
      {/* The section anchors live on the home page, so send them there. */}
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <DataTrustHero />
        <DeidentificationPanel />
        <AssuranceSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
