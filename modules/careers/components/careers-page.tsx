import { Navbar } from "@/modules/landing/components/navbar";
import { CtaSection } from "@/modules/landing/components/cta-section";
import { Footer } from "@/modules/landing/components/footer";
import { CareersHero } from "./careers-hero";
import { WhyReplaySection } from "./why-replay-section";
import { BenefitsSection } from "./benefits-section";
import { ValuesSection } from "./values-section";
import { OpenRolesSection } from "./open-roles-section";
import type { Team } from "../types";

export function CareersPage({ teams }: { teams: Team[] }) {
  return (
    <div className="flex flex-col">
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <CareersHero />
        <WhyReplaySection />
        <BenefitsSection />
        <ValuesSection />
        <OpenRolesSection initialTeams={teams} />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
