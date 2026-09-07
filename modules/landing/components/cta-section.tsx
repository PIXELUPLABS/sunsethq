import Image from "next/image";

export function CtaSection() {
  return (
    <section
      id="value-my-data"
      className="relative w-full overflow-hidden bg-black py-20 sm:py-24 lg:aspect-[1440/716] lg:py-0"
    >
      <Image
        src="/images/cta/background.webp"
        alt=""
        fill
        priority
        className="pointer-events-none object-cover"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[#eaebf1]"
        style={{
          maskImage: "url(/images/cta/black-mask.png)",
          maskSize: "cover",
          maskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskImage: "url(/images/cta/black-mask.png)",
          WebkitMaskSize: "cover",
          WebkitMaskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        <Image
          src="/images/texture-grain-white.png"
          alt=""
          fill
          className="object-cover mix-blend-multiply"
        />
      </div>

      <div
        className="relative mx-auto flex w-full max-w-[859px] flex-col items-center justify-center gap-8 overflow-hidden bg-[#fcfcfc] px-6 py-10 text-center sm:gap-14 sm:px-10 sm:py-14 lg:absolute lg:top-[23.6%] lg:left-[20.14%] lg:h-[52.79%] lg:w-[59.65%] lg:max-w-none lg:px-10 lg:py-0"
      >
        <Image
          src="/images/texture-grain-white.png"
          alt=""
          fill
          className="pointer-events-none object-cover"
        />

        <p className="relative max-w-[90%] font-serif text-3xl leading-none tracking-tight text-black sm:text-[38px]">
          Find out what your data is worth before you decide anything.
        </p>
        <a
          href="#value-my-data"
          className="relative flex items-center bg-ink px-5 py-3 font-serif text-xs uppercase tracking-wide text-white"
        >
          Value my data
        </a>

        <div className="relative flex w-full flex-col items-center gap-2 border-t border-dashed border-black/8 pt-6 text-center sm:absolute sm:inset-x-0 sm:bottom-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:border-t sm:px-4.5 sm:py-3 sm:text-left">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-4">
            <p className="font-mono text-[8px] whitespace-nowrap text-[#898989] uppercase tracking-wide">
              process
            </p>
            <p className="font-mono text-[8px] whitespace-nowrap text-[#898989] uppercase tracking-wide">
              identified → structured → verified → licensed
            </p>
          </div>
          <div className="border border-dashed border-[#d9d9d9] px-2 py-1.5">
            <p className="font-mono text-[8px] whitespace-nowrap text-[#898989] uppercase tracking-wide">
              RL-2026-001 // Version 1.0
            </p>
          </div>
          <p className="font-mono text-[8px] leading-tight text-[#898989] uppercase tracking-wide">
            classification
            <br />
            proprietary data / licensing
          </p>
        </div>
      </div>
    </section>
  );
}
