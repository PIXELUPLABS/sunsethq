import { Navbar } from "@/modules/landing/components/navbar";
import { Footer } from "@/modules/landing/components/footer";
import { ValueMyDataHero } from "./value-my-data-hero";

export function ValueMyDataPage() {
  return (
    <div className="flex flex-col">
      {/* Native async script must survive a failed React/Next bootstrap. */}
      <script src="/signup-monitor.js" async />
      {/* The navbar's own section anchors live on the home page. */}
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <ValueMyDataHero />
      </main>
      <Footer />
    </div>
  );
}
