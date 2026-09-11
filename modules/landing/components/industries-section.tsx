import Image from "next/image";
import { SectionTag } from "./section-tag";
import { IndustriesDiagram } from "./industries-diagram";

export function IndustriesSection() {
  return (
    <section
      id="who-its-for"
      className="relative flex scroll-mt-16 justify-center overflow-hidden bg-[#eaebf1] px-3 sm:px-18"
    >
      <Image
        src="/images/texture-grain-white.png"
        alt=""
        fill
        className="pointer-events-none object-cover mix-blend-multiply"
      />

      <div className="relative mx-auto flex w-full max-w-[1560px] flex-col items-center gap-10 border-x border-dashed border-[#d4d4d4] px-3 py-16 sm:px-10 sm:py-[120px] lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex max-w-[507px] flex-col items-start gap-5 lg:gap-6">
          <SectionTag
            label="Who it's for"
            icon={
              <Image
                src="/images/how-it-works-icon.svg"
                alt=""
                width={18}
                height={18}
              />
            }
          />
          <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-tight">
            Any industry.
            <br className="lg:hidden" />{" "}
            One requirement.
          </h2>
          <div className="flex flex-col gap-4 text-base leading-[1.4] tracking-[-0.48px] text-[#727272] lg:gap-2 lg:leading-relaxed lg:tracking-tight">
            <p>
              We work with companies in every industry. What matters
              isn&apos;t what you do, it&apos;s whether there&apos;s a record
              of how you did it: the communications, the tickets, the
              dispatch logs, the project histories, the back-and-forth that
              produced the outcome.
            </p>
            <p>
              This isn&apos;t a fit if you&apos;ve been operating less than a
              year, have fewer than five full-time people, or your work
              isn&apos;t documented.
            </p>
          </div>
        </div>

        <IndustriesDiagram />
      </div>
    </section>
  );
}
