import { Navbar } from "@/modules/landing/components/navbar";
import { CtaSection } from "@/modules/landing/components/cta-section";
import { Footer } from "@/modules/landing/components/footer";
import { BlogsHero } from "./blogs-hero";
import { BlogsJournalIndex } from "./blogs-journal-index";
import { BlogsStandardSection } from "./blogs-standard-section";

export function BlogsPage() {
  return (
    <div className="flex flex-col">
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <BlogsHero />
        <BlogsStandardSection />
        <BlogsJournalIndex />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
