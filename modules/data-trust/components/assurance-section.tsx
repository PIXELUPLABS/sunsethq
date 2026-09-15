import { ProcessMarkIcon } from "@/components/ui/process-mark-icon";
import { SectionTag } from "@/modules/landing/components/section-tag";
import {
  DATA_TRUST_GRAIN_STRIP,
  DATA_TRUST_GRAIN_STRIP_SIZE,
} from "../lib/assets";
import { ASSURANCE_ROWS } from "../lib/constants";
import { AssuranceRow } from "./assurance-row";

export function AssuranceSection() {
  return (
    <section className="relative flex justify-center overflow-hidden bg-[#eaebf1] px-3 sm:px-18">
      {/* Same bg colour + texture as the "Find out what your data is
          worth..." card in cta-section.tsx, tiled at that same card's own
          860x378 box scale (860/4320 of the asset's native 4320x2439, i.e.
          860x486) rather than the full native size - the native size is so
          much bigger than this section that a single tile would barely
          repeat at all, reading as one huge stretched image instead of a
          small tile. Repeats by default since no `background-repeat`
          override is set. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage: `url("/images/texture-grain-white.png")`,
          backgroundSize: "860px 486px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1560px] border-x border-dashed border-[#a8a8a8]">
        {/* the grain band and rule the design opens the section with */}
        <div
          aria-hidden
          className="pointer-events-none h-[46px] opacity-48 mix-blend-multiply sm:mx-10"
          style={{
            backgroundImage: `url("${DATA_TRUST_GRAIN_STRIP}")`,
            backgroundSize: DATA_TRUST_GRAIN_STRIP_SIZE,
          }}
        />
        <div className="border-t border-dashed border-[#a8a8a8]" />

        {/* The inner rules only frame the heading - below it the rows draw
            their own borders on the same lines. */}
        <div className="border-dashed border-[#a8a8a8] sm:mx-10 sm:border-x">
          <div className="px-3 pt-16 pb-10 sm:pt-[107px] sm:pb-[94px]">
            <div className="mx-auto flex max-w-[511px] flex-col items-center gap-3 text-center">
              <div className="flex flex-col items-center gap-6">
                <SectionTag
                  label="Legal"
                  icon={<ProcessMarkIcon className="size-[18px]" />}
                />
                <h2 className="font-serif text-[36px] leading-none tracking-[-1.44px] text-black sm:text-[44px] sm:tracking-[-1.76px]">
                  Your data stays yours.
                </h2>
              </div>
              <p className="text-sm leading-[1.4] tracking-[-0.42px] text-black">
                You don&apos;t need to start selling customer data to work with
                Replay. Raw data is used only for de-identification; only the
                cleaned output is ever licensed.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pb-16 sm:mx-10 sm:gap-6 sm:pb-[140px]">
          {ASSURANCE_ROWS.map((row, index) => (
            <AssuranceRow
              key={row.title}
              row={row}
              index={index}
              total={ASSURANCE_ROWS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
