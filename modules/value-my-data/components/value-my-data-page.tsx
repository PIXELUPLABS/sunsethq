import { Navbar } from "@/modules/landing/components/navbar";
import { Footer } from "@/modules/landing/components/footer";
import { ValueMyDataHero } from "./value-my-data-hero";

export function ValueMyDataPage() {
  return (
    <div className="flex flex-col">
      {/* The navbar's own section anchors live on the home page. */}
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <ValueMyDataHero />
      </main>
      <Footer />
    </div>
  );
}
