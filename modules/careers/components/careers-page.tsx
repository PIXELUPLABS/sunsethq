import { Navbar } from "@/modules/landing/components/navbar";
import { CtaSection } from "@/modules/landing/components/cta-section";
import { Footer } from "@/modules/landing/components/footer";
import { CareersHero } from "./careers-hero";
import { WhyReplaySection } from "./why-replay-section";
import { BenefitsSection } from "./benefits-section";
import { ValuesSection } from "./values-section";
import { OpenRolesSection } from "./open-roles-section";

export function CareersPage() {
  return (
    <div className="flex flex-col">
      {/* The navbar's section anchors live on the home page. */}
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <CareersHero />
        <WhyReplaySection />
        <BenefitsSection />
        <ValuesSection />
        <OpenRolesSection />
        {/* Same section every other page reuses (see data-trust-page.tsx),
            unchanged - no Careers-specific copy/prop overrides, per
            feedback to match the main page's CtaSection exactly. Keeps
            its "value-my-data" id regardless, since the navbar's own CTA
            always targets that id on every page. */}
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
