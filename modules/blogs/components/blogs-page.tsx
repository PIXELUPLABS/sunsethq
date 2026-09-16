import { Navbar } from "@/modules/landing/components/navbar";
import { CtaSection } from "@/modules/landing/components/cta-section";
import { Footer } from "@/modules/landing/components/footer";
import { BlogsHero } from "./blogs-hero";
import { BlogsJournalIndex } from "./blogs-journal-index";
import { BlogsStandardSection } from "./blogs-standard-section";

export function BlogsPage() {
  return (
    <div className="flex flex-col">
      {/* The section anchors live on the home page, so send them there. */}
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <BlogsHero />
        <BlogsStandardSection />
        <BlogsJournalIndex />
        {/* Same section every other page reuses (see data-trust-page.tsx,
            careers-page.tsx), unchanged - no Blogs-specific copy/prop
            overrides. Keeps its "value-my-data" id regardless, since the
            navbar's own CTA always targets that id on every page. */}
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
