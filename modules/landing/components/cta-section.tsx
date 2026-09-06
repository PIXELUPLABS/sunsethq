import Image from "next/image";

export function CtaSection() {
  return (
    <section id="value-my-data" className="bg-brand-gradient relative overflow-hidden px-6 py-20 sm:px-18">
      <div className="relative mx-auto flex max-w-[1071px] flex-col items-center">
        <Image
          src="/images/cta-paper-stack.png"
          alt=""
          width={1071}
          height={502}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-contain opacity-90"
        />

        <div className="relative flex w-full max-w-[859px] flex-col items-center gap-14 bg-[#fcfcfc] p-10 text-center sm:p-18">
          <p className="max-w-[755px] font-serif text-3xl leading-none tracking-tight text-black sm:text-[54px]">
            Find out what your data is worth before you decide anything.
          </p>
          <a
            href="#value-my-data"
            className="flex items-center bg-ink px-5 py-3 font-serif text-xs uppercase tracking-wide text-white"
          >
            Value my data
          </a>

          <div className="flex w-full items-center justify-between text-[8px] font-mono uppercase tracking-wide text-[#898989]">
            <span>Identified → structured → verified → licensed</span>
            <span className="hidden sm:inline">RL-2026-001 // Version 1.0</span>
          </div>
        </div>
      </div>
    </section>
  );
}
