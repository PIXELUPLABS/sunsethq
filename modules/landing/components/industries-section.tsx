import Image from "next/image";
import { SectionTag } from "./section-tag";

export function IndustriesSection() {
  return (
    <section className="relative flex justify-center overflow-hidden bg-[#eaebf1] px-6 py-20 sm:px-18">
      <Image
        src="/images/texture-grain-white.png"
        alt=""
        fill
        className="pointer-events-none object-cover mix-blend-multiply"
      />

      <div className="relative flex w-full flex-col items-center gap-14 border-x border-dashed border-[#d4d4d4] px-5 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex max-w-[507px] flex-col items-start gap-6">
          <SectionTag label="Who it's for" />
          <h2 className="font-serif text-[32px] leading-none tracking-tight text-black sm:text-[44px]">
            Any industry. One requirement.
          </h2>
          <div className="flex flex-col gap-2 text-base leading-relaxed tracking-tight text-[#727272]">
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

        <Image
          src="/images/industry-diagram.png"
          alt="Diagram of industries Replay works with: healthcare, media, insurance, service, legal, energy, finance, and CPG, arranged around a central data node"
          width={665}
          height={671}
          className="h-auto w-full max-w-[560px]"
        />
      </div>
    </section>
  );
}
