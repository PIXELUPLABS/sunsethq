import { Navbar } from "@/modules/landing/components/navbar";
import { Footer } from "@/modules/landing/components/footer";
import { RevenueStreamSection } from "@/modules/landing/components/revenue-stream-section";
import { ReferralsHero } from "./referrals-hero";
import { ReferralPayoutsSection } from "./referral-payouts-section";
import { HowItWorksSection } from "./how-it-works-section";
import { EligibilitySection } from "./eligibility-section";

export function ReferralsPage() {
  return (
    <div className="flex flex-col">
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <ReferralsHero />
        <RevenueStreamSection />
        <ReferralPayoutsSection />
        <HowItWorksSection />
        <EligibilitySection />
      </main>
      <Footer />
    </div>
  );
}
